import { definePreset, executeCommand, installPackages } from '@preset/core'

export default definePreset({
	name: 'laravel:pest',
	postInstall: ({ hl }) => [
		`Write your own expectations and helpers in ${hl('tests/Pest.php')}`,
		`Make new tests with ${hl('php artisan make:test --pest')}`,
		`Run ${hl('php artisan test')} to run your test suite`
	],
	handler: async() => {
		await installPackages({ 
			for: 'php',
			install: ['pestphp/pest', 'pestphp/pest-plugin-laravel'],
			additionalArgs: ['--with-all-dependencies'],
			title: 'install dependencies',
		})

		await executeCommand({
			command: 'php',
			arguments: ['artisan', 'pest:install', '--no-interaction'],
			title: 'setup Pest',
			ignoreExitCode: true
		})
	},
})
