<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { registerSchema } from '$lib/zod-schema';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';

	const form = superForm(defaults(zod(registerSchema)), {
		validators: zodClient(registerSchema),
		resetForm: false,
		onResult({ result }) {
			if (result.type === 'failure') {
				toast.error('Wrong username or password.');
			} else if (result.type === 'success') {
				toast.success('Register successfully!');
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<div class="container relative h-screen flex-col items-center justify-center">
	<div class="flex h-full w-full flex-col items-center justify-center">
		<div class="mx-auto flex w-full max-w-md flex-col justify-center space-y-6">
			<form method="POST" use:enhance action="?/register">
				<div class="space-y-6 text-center">
					<div class="space-y-2">
						<div class="text-4xl font-bold">Register</div>
						<div class="text-muted-foreground">Enter your account details</div>
					</div>
					<div class="space-y-4">
						<Form.Field {form} name="username">
							<Form.Control>
								{#snippet children({ props })}
									<Input {...props} bind:value={$formData.username} placeholder="Username" />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="password">
							<Form.Control>
								{#snippet children({ props })}
									<Input {...props} bind:value={$formData.password} placeholder="Password" />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					<Form.Button class="w-full">Register</Form.Button>
					<Button variant="outline" class="w-full" href="/login">Login</Button>
				</div>
			</form>
		</div>
	</div>
</div>
