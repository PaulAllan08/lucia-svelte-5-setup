import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

const userRoles = ['user', 'admin'] as const;
export type UserRole = (typeof userRoles)[number];
export const userRole = pgEnum('role', userRoles);

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	hashedPassword: text('hashed_password').notNull(),
	role: userRole('role').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
