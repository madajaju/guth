
const create = require('./create');
const update = require('./update');
const publish = require('./publish');
const promote = require('./promote');
const crossPromote = require('./crossPromote');


create.fn({episode:episode});
update.fn({episode:episode});
publish.fn({episode:episode});
promote.fn({episode:episode});
crossPromote.fn({episode:episode});
