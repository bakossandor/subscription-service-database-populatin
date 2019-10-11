const bcrypt = require('bcrypt');

const format = require('pg-format');
const { Pool }   = require('pg');
const pool = new Pool();

const users = require('./data/users.json');
const newsletters = require('./data/newsletters.json');
const subscribers = require('./data/subs.json');

const round = 10;
async function encryptPassword(password) {
  return await bcrypt.hash(password, round);
}

// Inserting users to the database
async function insertUsers(users) {
  try {
    // Hashing the password
    const values = await Promise.all(users.map(async(userArray) => {
      userArray[userArray.length - 1] = await encryptPassword(userArray[userArray.length - 1]);
      return userArray;
    }));
    // INSERT query the pg database - credentials in the .env file
    const queryString = format('INSERT into users (first_name, last_name, email, password) VALUES %L', values);
    await pool.query(queryString);
  } catch (error) {
    console.log('Error inserting users', error);
    throw new Error(error)
  }
}

// Getting all inserted users from the database
async function getAllUser() {
  const queryString = 'SELECT id FROM "users"';
  const { rows } = await pool.query(queryString);
  return rows;
}

// Inserting newsletters to db
async function insertNewsLetters(newsletters) {
  try {
    // fetching the users for the id's to later serve as a foreign key
    const users = await getAllUser();
    newsletters.forEach((newsletter, idx) => {
      newsletter.push(users[idx].id);
    })
    const queryString = format('INSERT into newsletters (name, uri, user_id) VALUES %L', newsletters);
    await pool.query(queryString);
  } catch (error) {
    console.log('Error inserting newsletters', error);
    throw new Error(error)
  }
}

async function getNewsLetters() {
  try {
    const queryString = 'SELECT id FROM "newsletters"';
    const { rows } = await pool.query(queryString);
    return rows;
  } catch (error) {
    console.log('Error getting newsletters', error);
    throw new Error(error)
  }
}

async function insertSubs(subs) {
  try {
    // fetching the newsletters
    const newsletters = await getNewsLetters();
    // extending subs with newsletter ids in order to have the foreign keys
    subs.forEach((sub, idx) => {
      sub.push(newsletters[idx % 3].id)
    });
    const queryString = format('INSERT into subscribers (first_name, last_name, email, newsletter_id) VALUES %L', subs);
    await pool.query(queryString);
  } catch (error) {
    console.log('Error inserting subscribers', error);
    throw new Error(error)
  }
}

async function clear() {
  try {
    // deleting all users will get rid of all of the other data as well
    // foreign key on delete cascade as the id referenced in other tables
    const queryString = 'DELETE FROM users;'
    await pool.query(queryString);
  } catch (error) {
    console.log('error occoured during clearing the db', error);
    throw new Error(error);
  }
}

clear()
  .then(() => {
    console.log('databases are cleared');
  })
  .then(() => insertUsers(users))
  .then(() => console.log('users inserted'))
  .then(() => insertNewsLetters(newsletters))
  .then(() => console.log('newsletters inserted'))
  .then(() => insertSubs(subscribers))
  .then(() => console.log('subscribers inserted'))
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1)
  })