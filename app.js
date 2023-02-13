const express = require('express');
const app = express();
const db = require('./models');
const { Member } = db;

app.use(express.json());

app.get('/api/members', async (req, res) => {
  const { team } = req.query;
  if (team) {
    const teamMember = await Member.findAll({ where: { team } });
    res.send(teamMember);
  } else {
    const members = await Member.findAll();
    res.send(members);
  };
});

app.get('/api/members/:id', async (req, res) => {
  // const memberId = req.params.id;
  const { id } = req.params;

  // res.send(members[memberId - 1]);
  const member = await Member.findOne({ where: { id } });

  if (member) {
    res.send(member);
  } else {
    res.status(404).send({ message: "There is no member with the ID!" });
  }
});

app.post('/api/members', async (req, res) => {
  const newMember = req.body;
  // if (newMember) {
  //   members.push(newMember);
  //   res.send({ message: "Added successfully" })
  // } else {
  //   res.status(404).send({ message: "No information" })
  // }

  const member = Member.build(newMember);
  await member.save();
  res.send(newMember);
});

// app.put('/api/members/:id', async (req, res) => {
//   const { id } = req.params;
//   const newInfo = req.body;
//   const result = await Member.update(newInfo, { where: { id } });
//   if (result[0]) {
//     // Object.keys(newInfo).forEach(p => { // code it
//     //   member[p] = newInfo[p];
//     // })
//     res.send({ message: `$result[0] rows affected.` });
//   } else {
//     res.status(404).send({ message: "There is no member with the ID." })
//   }
// });

app.put('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  const member = await Member.findOne({ where: { id } });
  if (member) {
    Object.keys(newInfo).forEach(p => {
      member[p] = newInfo[p];
    });
    await member.save();
    res.send(member);
  } else {
    res.status(404).send({ message: 'There is no member with the ID.' });
  }
})

app.delete('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  // const membersCount = members.length; // codeit
  // members = members.filter(m => member.id !== Number(id));
  // if(members.length < membersCount) {
  //   res.send({ message: "Deleted Successfully!" });
  // } else {
  //   res.status(400).send({ message: "error~~~" })
  // }
  const deleteCount = await Member.destroy({ where: { id } });
  if (deleteCount) {
    res.send({ message: `${deleteCount} rows deleted.` });
  } else {
    res.status(404).send({ message: "There is no member with the ID." })
  }
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is listening the port 3000');
});