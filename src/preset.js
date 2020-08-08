const { Preset } = require('use-preset');

// prettier-ignore
module.exports = Preset.make('Laravel Pest')
	.option('interaction', true)

	.editJson('composer.json')
		.title('Add Pest and its dependencies')
		.delete(['require-dev.phpunit/phpunit', 'require-dev.nunomaduro/collision'])
		.merge({
			'minimum-stability': 'dev',
			'prefer-stable': true,
			'require-dev': {
				'nunomaduro/collision': '^5.0',
				'phpunit/phpunit': '^9.0',
				'pestphp/pest': '^0.2.4',
				'pestphp/pest-plugin-laravel': '^0.2',
			},
			scripts: {
				test: '.\\vendor\\bin\\pest'
			}
		})
		.chain()

	.updateDependencies()
		.withoutAsking(({ flags }) => Boolean(flags.interaction))
		.for('php')
		.chain()

	.command('php artisan pest:install --no-interaction --no-ansi')
		.title('Install Pest')
		.withOptions({ stdio: 'pipe' })
		.withHook(() => (child) => {
			// Needed until Pest v0.3, because it will not listen to
			// --no-interaction until then
			child.stdin.write('no\n');
		})
		.chain();
