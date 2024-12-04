import * as auth from '$lib/server/auth';
import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { loginSchema } from '$lib/zod-schema';
import { zod } from 'sveltekit-superforms/adapters';
import { verify } from '@node-rs/argon2';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	return {
		loginForm: await superValidate(zod(loginSchema))
	};
};

export const actions: Actions = {
	login: async (event) => {
		const form = await superValidate(event, zod(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { username, password } = form.data;

		const existingUser = await db.query.user.findFirst({
			where: (user, { eq }) => eq(user.username, username),
			columns: {
				id: true,
				username: true,
				hashedPassword: true,
				role: true
			}
		});

		if (!existingUser) {
			return setError(form, 'username', 'email not found');
		}

		const validPassword = await verify(existingUser.hashedPassword, password);

		if (!validPassword) {
			return setError(form, 'password', 'Incorrect password');
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	}
};
