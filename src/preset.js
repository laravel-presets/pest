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
				'pestphp/pest': '^0.2.4',
				'pestphp/pest-plugin-laravel': '^0.2',
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

	// Installs Pest. The code is weird, because there is an issue until Pest v0.3
	// where it is not listening to --no-interaction.
	.command('php', ['artisan', 'pest:install', '--no-interaction'])
		.title('Install Pest')
		.withOptions({ stdio: process.platform === 'linux' ? 'ignore' : 'pipe' })
		.withHook(() => (child) => {
			// Can't get this to work with Linux, because I lack understanding
			// of how it works
			if (process.platform === 'linux') {
				return;
			}

			// Needed until Pest v0.3, because it will not listen to
			// --no-interaction until then
			child.stdin.write('no\r\n');
			child.stdin.end();
		})
		.chain();
