const Router = require('@koa/router');
const flavourEntriesController = require('../controllers/flavourEntries');

const router = new Router();
router.prefix('/flavours');

router.post('/add', (ctx) => {
  const { date, productionType, flavourEntryData } = ctx.body;

  // TODO: check all flavour data entry properties exist
  // TODO: maybe use koa bouncer

  flavourEntriesController
    .addFlavorEntry(date, productionType, flavourEntryData)
    .then((res, newEntry) => {
      if (res === 200) {
        ctx.status = 201;
        ctx.body = newEntry;
      } else {
        ctx.status = 500;
      }
    })
    .catch((err) => {
      ctx.status = 500;
      console.error(err);
    });
});

router.post('/update', (ctx) => {
  const { id, productionType, flavourEntryData } = ctx.body;

  flavourEntriesController
    .updateFlavorEntry(id, productionType, flavourEntryData)
    .then((res, newEntry) => {
      if (res === 200) {
        ctx.status = 201;
        ctx.body = newEntry;
      } else {
        ctx.status = 500;
      }
    })
    .catch((err) => {
      ctx.status = 500;
      console.error(err);
    });
});

router.post('/delete', (ctx) => {
  const { id, productionType } = ctx.body;

  flavourEntriesController
    .deleteFlavorEntry(id, productionType)
    .then((res) => {
      if (res === 200) {
        ctx.status = 200;
      } else {
        ctx.status = 500;
      }
    })
    .catch((err) => {
      ctx.status = 500;
      console.error(err);
    });
});

router.post('/get', (ctx) => {
  const { date, productionType } = ctx.body;

  flavourEntriesController
    .getFlavourEntries(date, productionType)
    .then((res, entries) => {
      if (res === 200) {
        ctx.status = 200;
        ctx.body = entries;
      } else {
        ctx.status = 500;
      }
    })
    .catch((err) => {
      ctx.status = 500;
      console.error(err);
    });
});

module.exports = router;
