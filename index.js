const crypto = require('crypto');
const fs = require('fs');

module.exports = function(path, lifetime, encoding) {
	lifetime = lifetime || 3600; // 1 hour
	encoding = encoding || 'utf8';
	path = path || './.ez-cache';

	const createCacheDir = () => {
		if (fs.existsSync(path)) {
			return;
		}

		try {
			fs.mkdirSync(path);

		} catch (err) {
			throw new Error(`Could not create dir "${path}". Error says: "${err}"`);
		}
	}

	return {
		set: (cacheFile, data, infinite) => {
			createCacheDir();

			const created = Date.now();
			const expires = infinite !== true
				? created + (lifetime * 1000)
				: 0;

			const writeMe = JSON.stringify({created, expires, data});

			return new Promise((resolve, reject) => {
				fs.writeFile(cacheFile, writeMe, encoding, err => {
					if (err) reject(err);
					resolve(writeMe);
				});
			});
		},
		get: (cacheFile, returnAll) => {
			createCacheDir();

			return new Promise((resolve, reject) => {
				fs.readFile(cacheFile, (err, entry) => {
					if (err) reject(err);
					const entryObj = JSON.parse(entry);
					resolve(returnAll ? entryObj : entryObj.data);
				});
			});
		},
		exists: cacheFile => {
			createCacheDir();

			if (fs.existsSync(cacheFile)) {
				try {
					const entry = JSON.parse(fs.readFileSync(cacheFile));
					return parseInt(entry.expires) === 0 || entry.expires > Date.now();
				}catch(err) {
					console.log(`err parsing json in file ${cacheFile}`, err);
					return false;
				}
			}

			return false;
		},
		getFilePath: url => {
			const filename = `${crypto.createHash('md5').update(url).digest('hex')}.json`;
			return `${path}/${filename}`;

		},
	};
}