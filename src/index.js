import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;
const buckets = {};

app.use(cors());
app.use(express.json());

const userMid = (req, res, next) => {
	if (!req.headers.bucket) {
		res.status(400).send("missing bucket");
	} else {
		if (!buckets[req.headers.bucket]) buckets[req.headers.bucket] = [];
		res.locals.bucket = buckets[req.headers.bucket];
		next();
	}
};

app.put("/", userMid, (req, res) => {
	res.locals.bucket.push(req.body);
	res.send(res.locals.bucket);
});

app.get("/", userMid, (req, res) => {
	res.send(res.locals.bucket);
});

app.get("/:id", userMid, (req, res) => {
	res.send(res.locals.bucket[req.params.id] || null);
});

app.post("/:id", userMid, (req, res) => {
	if (res.locals.bucket[req.params.id]) {
		Object.assign(res.locals.bucket[req.params.id], req.body);
		res.send(res.locals.bucket);
	} else {
		res.status(400).send("id does not exist");
	}
});

app.delete("/:id", userMid, (req, res) => {
	if (res.locals.bucket[req.params.id]) {
		buckets[req.headers.bucket] = buckets[req.headers.bucket].filter(
			(e, i) => i != req.params.id
		);
		res.send(buckets[req.headers.bucket]);
	} else {
		res.status(400).send("id does not exist");
	}
});

const server = app.listen(port, () => console.log(`Listening on port ${port}`));
