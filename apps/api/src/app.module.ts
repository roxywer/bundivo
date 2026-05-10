import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { GroupsModule } from './groups/groups.module'
import { PaymentsModule } from './payments/payments.module'
import { AdminModule } from './admin/admin.module'
import { RealtimeModule } from './realtime/realtime.module'
import { MessagesModule } from './messages/messages.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    GroupsModule,
    PaymentsModule,
    AdminModule,
    RealtimeModule,
    MessagesModule,
  ],
})
export class AppModule {}
