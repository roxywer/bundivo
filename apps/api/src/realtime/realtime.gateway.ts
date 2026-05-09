import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/',
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private userSockets = new Map<string, Set<string>>()

  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '')
      if (!token) { client.disconnect(); return }

      const payload = this.jwt.verify(token, { secret: this.config.get('JWT_SECRET') })
      const userId: string = payload.sub
      client.data.userId = userId

      if (!this.userSockets.has(userId)) this.userSockets.set(userId, new Set())
      this.userSockets.get(userId)!.add(client.id)

      client.join(`user:${userId}`)
    } catch {
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId
    if (userId) {
      this.userSockets.get(userId)?.delete(client.id)
      if (this.userSockets.get(userId)?.size === 0) this.userSockets.delete(userId)
    }
  }

  @SubscribeMessage('join_group')
  handleJoinGroup(@ConnectedSocket() client: Socket, @MessageBody() groupId: string) {
    client.join(`group:${groupId}`)
  }

  @SubscribeMessage('leave_group')
  handleLeaveGroup(@ConnectedSocket() client: Socket, @MessageBody() groupId: string) {
    client.leave(`group:${groupId}`)
  }

  emitToGroup(groupId: string, event: string, data: any) {
    this.server.to(`group:${groupId}`).emit(event, data)
  }

  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data)
  }

  emitToAll(event: string, data: any) {
    this.server.emit(event, data)
  }
}
