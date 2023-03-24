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
                    scripts: {
                        "test": [
                            "@php artisan test --parallel --order-by random"
                        ],
                        "test-coverage": [
                            "@php artisan test --coverage"
                        ],
                    },
					config: {
						'allow-plugins': {
							'pestphp/pest-plugin': true,
						},
					},
				},
			}],
		})

		await executeCommand({
			title: 'remove phpunit',
			command: 'composer',
			arguments: ['remove', 'phpunit/phpunit', '--dev'],
			ignoreExitCode: true,
		})

		await installPackages({
			for: 'php',
			dev: true,
			install: ['pestphp/pest:^2.0', 'pestphp/pest-plugin-laravel:^2.0'],
			additionalArgs: ['--with-all-dependencies'],
			title: 'install dependencies',
		})

		await executeCommand({
			command: 'php',
			arguments: ['./vendor/bin/pest', '--init'],
			title: 'setup Pest',
			ignoreExitCode: true,
		})
	},
})
