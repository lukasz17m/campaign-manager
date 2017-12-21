const router = require('express').Router();

const resolve = require('../utils/resolve');

const connection = require(resolve('modules/mongoose/connection'));
const { Campaign, User } = require(resolve('modules/mongoose/model'));

/**
* Middleware
*/

router.use((req, res, next) => {
  console.log(`[${(new Date()).toLocaleString()}] ${req.method} ${req.url}`);

  next();
});

router.all('/', (req, res) => {
  res.json({ method: req.method, route: req.url });
});

// Get user
router.get('/user/:token', (req, res) => {
  const { token } = req.params;

  User.findOne({ token })
    .then(user => {
      if (!user) {
        res.send(null);
        return;
      }

      res.json({
        id: user._id,
        name: user.name,
        balance: user.balance,
      });
    })
    .catch(error => res.status(500).send(error));
});

// Update user (balance)
router.put('/user/:token/', (req, res) => {
  const { balance } = req.body;
  const { token } = req.params;

  User.findOneAndUpdate({ token }, { $set: { balance } }, { runValidators: true })
    .then(user => {
      if (!user) {
        res.send(null);
        return;
      }

      res.json({ balance });
    })
    .catch(error => {
      if (error.name === 'ValidationError') {
        return res.send(null);
      }
      return res.status(500).send(error);
    });
});

// Get campaigns
router.get('/campaigns', (req, res) => {
  Campaign.find({})
    .sort({ _id: 'desc' })
    .then(campaigns => {
      res.json(campaigns.map(campaign => ({
        id: campaign._id,
        name: campaign.name,
        keywords: campaign.keywords,
        bidAmount: campaign.bidAmount,
        campaignFund: campaign.campaignFund,
        status: campaign.status,
        town: campaign.town,
        radius: campaign.radius,
      })));
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Create campaign
router.post('/campaign', (req, res) => {
  new Campaign(req.body).save()
    .then(campaign => {
      res.json({
        id: campaign._id,
        name: campaign.name,
        keywords: campaign.keywords,
        bidAmount: campaign.bidAmount,
        campaignFund: campaign.campaignFund,
        status: campaign.status,
        town: campaign.town,
        radius: campaign.radius,
      });
    })
    .catch(error => {
      res.status(500).send(error);
    });
});


// Get campaign
router.get('/campaign/:id', (req, res) => {
  const { id } = req.params;

  Campaign.findById(id)
    .then(campaign => {
      res.json({
        id: campaign._id,
        name: campaign.name,
        keywords: campaign.keywords,
        bidAmount: campaign.bidAmount,
        campaignFund: campaign.campaignFund,
        status: campaign.status,
        town: campaign.town,
        radius: campaign.radius,
      });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Update campaign
router.put('/campaign/:id', (req, res) => {
  const campaign = req.body;
  const { id } = req.params;

  Campaign.findOneAndUpdate({ _id: id }, { $set: {
    name: campaign.name,
    keywords: campaign.keywords,
    bidAmount: campaign.bidAmount,
    campaignFund: campaign.campaignFund,
    status: campaign.status,
    town: campaign.town,
    radius: campaign.radius,
  } }, { runValidators: true })
    .then(updatedCampaign => {
      if (!updatedCampaign) {
        res.send(null);
        return;
      }

      res.json(updatedCampaign);
    })
    .catch(error => {
      if (error.name === 'ValidationError') {
        return res.send(null);
      }
      return res.status(500).send(error);
    });
});

// Delete campaign
router.delete('/campaign/:id', (req, res) => {
  const { id } = req.params;

  Campaign.remove({ _id: id })
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

/**
* CRUD
*/

// Create
// router.post('/notes', (req, res) => {
//   new Note({
//     content: req.body.content,
//     tags: req.body.tags,
//   }).save()
//     .then((note) => {
//       res.json({
//         /* eslint-disable no-underscore-dangle */
//         id: note._id,
//         content: note.content,
//         tags: note.tags,
//       });
//     })
//     .catch((error) => {
//       res.status(500).send(error);
//     });
// });

// // Read
// router.get('/notes', (req, res) => {
//   Note.find({})
//     .sort({ _id: 'asc' })
//     .then((notes) => {
//       res.json(notes.map(note => ({
//         /* eslint-disable no-underscore-dangle */
//         id: note._id,
//         content: note.content,
//         tags: note.tags,
//       })));
//     })
//     .catch((error) => {
//       res.status(500).send(error);
//     });
// });

// // Update
// router.put('/notes/:id', (req, res) => {
//   Note.findById(req.params.id)
//     .then((note) => {
//       note.set({
//         content: req.body.content,
//         tags: req.body.tags,
//       });

//       return note.save();
//     })
//     .then((note) => {
//       res.json({
//         /* eslint-disable no-underscore-dangle */
//         id: note._id,
//         content: note.content,
//         tags: note.tags,
//       });
//     })
//     .catch((error) => {
//       if (error.name === 'CastError') {
//         res.status(404).send('Note doesn’t exist');
//       } else {
//         res.status(500).send(error);
//       }
//     });
// });

// // Delete
// router.delete('/notes/:id', (req, res) => {
//   Note.findById(req.params.id)
//     .then((note) => {
//       if (!note) {
//         res.status(404).send('Note doesn’t exist');
//       } else {
//         note.remove().then(() => {
//           res.json({
//             /* eslint-disable no-underscore-dangle */
//             id: note._id,
//             content: note.content,
//             tags: note.tags,
//           });
//         });
//       }
//     })
//     .catch((error) => {
//       if (error.name === 'CastError') {
//         res.status(404).send('Note doesn’t exist');
//       } else {
//         res.status(500).send(error);
//       }
//     });
// });

module.exports = router;
