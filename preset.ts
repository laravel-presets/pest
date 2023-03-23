import { definePreset, editFiles, executeCommand, installPackages } from '@preset/core'

export default definePreset({
	name: 'laravel:pest',
	postInstall: ({ hl }) => [
		`Write your own expectations and helpers in ${hl('tests/Pest.php')}`,
		`Make new tests with ${hl('php artisan make:test --pest')}`,
		`Run ${hl('php artisan test')} to run your test suite`,
	],
	handler: async() => {
		await editFiles({
			files: 'composer.json',
			title: 'register the composer plugin',
			operations: [{
				type: 'edit-json',
				merge: {
					config: {
						'allow-plugins': {
							'pestphp/pest-plugin': true,
						},
					},
				},
			}],
		})

		await executeCommand({
			title: 'downgrade collision and phpunit',
			command: 'composer',
			arguments: ['remove', 'nunomaduro/collision', 'phpunit/phpunit', '--dev'],
			ignoreExitCode: true,
		})

		await installPackages({
			for: 'php',
			dev: true,
			install: ['nunomaduro/collision:^6.4', 'pestphp/pest:^1.22', 'pestphp/pest-plugin-laravel:^1.2'],
			additionalArgs: ['--with-all-dependencies'],
			title: 'install dependencies',
		})

		await executeCommand({
			command: 'php',
			arguments: ['artisan', 'pest:install', '--no-interaction'],
			title: 'setup Pest',
			ignoreExitCode: true,
		})
	},
})
