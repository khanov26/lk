const path = require('path');
const jsonServer = require('json-server');
const auth = require('json-server-auth');
const cors = require('cors');

const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));

app.db = router.db;

const rules = auth.rewriter({
    contacts: 660,
});

app.use(cors());
app.use(rules)
app.use(auth);
app.use(router);
app.listen(3001, () => {
    console.log('json server is running');
});
