const { Preset } = require('use-preset');

// prettier-ignore
module.exports = Preset.make('Laravel Pest')
	.option('interaction', true)
	.option('install', true)

	.editJson('composer.json')
		.title('Add Pest and its dependencies')
		.delete(['require-dev.phpunit/phpunit', 'require-dev.nunomaduro/collision'])
		.merge({
			'minimum-stability': 'dev',
			'prefer-stable': true,
			'require-dev': {
				'nunomaduro/collision': '^5.0',
				'phpunit/phpunit': '^9.0',
				'pestphp/pest': '^0.3',
				'pestphp/pest-plugin-laravel': '^0.3',
			},
			scripts: {
				test: '.\\vendor\\bin\\pest'
			}
		})
		.chain()

	.updateDependencies()
		.withoutAsking(({ flags }) => Boolean(flags.interaction) && Boolean(flags.install))
		.for('php')
		.chain()

	.command('php', ['artisan', 'pest:install', '--no-interaction'])
		.title('Install Pest')
		.chain();
