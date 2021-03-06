const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


// POST REQUESTS //

// POST meals and ingredients to database
router.post('/', (req, res) => {
    const queryMeal = `INSERT INTO "meal" ("meal_name", "recipe", "image")
    VALUES ($1, $2, $3) RETURNING "meal".id;`;
    pool.query(queryMeal, [req.body.name, req.body.recipe, req.body.image])
        .then((result) =>{
            console.log('looking for name', result.rows)
            let [one] = result.rows;
            const queryIngredient = `INSERT INTO "ingredient" ("ingredient_name", "meal_id") VALUES ($1,$2);`;
            for(let i = 0; i < req.body.ingredients.length; i++) {
                console.log(i);
                pool.query(queryIngredient, [req.body.ingredients[i], one.id])
                    .then(result => {
                        console.log('in post request', req.body);
                        res.sendStatus(200);
                    }).catch(error => {
                        console.log('error with post request', error)
                    });
                }
        }).catch((err)=>{
            console.log('error with post request', err);
        })
});

// POST new list
router.post('/list', (req, res) => {
    const queryText = `INSERT INTO "list" ("list_name")
    VALUES ($1)`
    pool.query(queryText, [req.body.listName]).then(result => {
        console.log('posting list', req.body);
        res.sendStatus(200);
    }).catch( error => {
        console.log('error with posting list', error);
        res.sendStatus(500);
    })
})

// POST new ingredients from list
router.post('/fromlist', (req, res) => {
    const queryList = `INSERT INTO "ingredient" ("ingredient_name", "list_id")
    VALUES ($1, $2);`;
    pool.query(queryList, [req.body.ingredients, req.body.id])
        .then(result => {
            console.log('in post request', req.body);
            res.sendStatus(200);
        }).catch(error => {
            console.log('error with post request', error)
            res.sendStatus(500);
        });
});

// POST ingredients to list from meal
router.post('/fromMeal', (req, res) => {
    const queryList = `INSERT INTO "ingredient" ("ingredient_name", "list_id")
    VALUES ($1, $2);`;
    pool.query(queryList, [req.body.ingredients, req.body.id])
        .then(result => {
            console.log('in post request', req.body);
            res.sendStatus(200);
        }).catch(error => {
            console.log('error with post request', error)
            res.sendStatus(500);
        });
});

//!! END POST REQUESTS !!//

// GET REQUESTS //

// GET specific list
router.get('/list/:id', (req, res) =>{
    const queryText = `SELECT * FROM "list" WHERE "id" = $1;`;
    pool.query(queryText, [req.params.id]).then(result => {
        res.send(result.rows)
        console.log(result.rows)
    }).catch(error => {
        console.log('error with getting specific list', error);
        res.sendStatus(500);
    })
})

// GET lists
router.get('/list', (req, res) => {
    console.log('getting lists');
    const queryText = `SELECT * FROM "list";`;
    pool.query(queryText).then(result => {
        console.log('here are the lists', result.rows);
        res.send(result.rows);
    }).catch(error => {
        console.log('error with getting list', error)
        res.sendStatus(500);
    })
});

// GET ingredients from specific list
router.get('/list/ingredients/:id', (req, res) => {
    const queryText = `SELECT "ingredient".ingredient_name from "ingredient" 
    JOIN "list" ON "ingredient".list_id = "list".id WHERE "list".id = $1`;
    pool.query(queryText, [req.params.id]).then(result => {
        console.log('getting ingredients for specific list', result.rows);
        res.send(result.rows);
    }).catch(error => {
        console.log('error with getting ingredients from specific list', error);
        res.sendStatus(500);
    })
});

// GET meals
router.get('/', (req, res) => {
    console.log('getting meals');
    const queryText = `SELECT * FROM "meal";`;
    pool.query(queryText).then(result => {
        res.send(result.rows)
    }).catch(error => {
        console.log('error with getting meals', error)
        res.sendStatus(500);
    })
});

// GET ingredients for specific meal
router.get('/:id', (req, res) => {
    const queryText = `SELECT "ingredient".id, "ingredient".ingredient_name FROM "ingredient"
    JOIN "meal" ON "meal".id = "ingredient".meal_id
    WHERE "meal".id = $1;`;
    pool.query(queryText, [req.params.id]).then(result => {
        console.log('this is ingredient', result.rows);
        res.send(result.rows)
    }).catch(error => {
        console.log('error with getting ingredients', error);
        res.sendStatus(500);
    })
})

// GET single meal
router.get('/details/:id', (req, res) =>{
    const queryText = `SELECT * FROM "meal" WHERE "id" = $1;`;
    pool.query(queryText, [req.params.id]).then(result => {
        res.send(result.rows)
        console.log(result.rows)
    }).catch(error => {
        console.log('error with getting specific meal', error);
        res.sendStatus(500);
    })
})

//!! END GET REQUESTS !!//

// PUT REQUESTS //

// PUT request to update ingredients table with list id
router.put('/:id', (req, res) => {
    const queryText = `UPDATE "ingredient" SET "list_id" = $1 WHERE "id" = $2;`;
    pool.query(queryText, [req.params])
})

// PUT request to update meal
router.put('/', (req, res) => {
    const updatedMeal = req.body;
    const queryText = `UPDATE "meal" SET "meal_name" = $1, "recipe" = $2 WHERE "id" = $3;`;
    const queryValues = [
        updatedMeal.newName,
        updatedMeal.newRecipe,
        updatedMeal.id
    ]
    console.log(queryValues);
    pool.query(queryText, queryValues).then(() => {
        res.sendStatus(200);
    }).catch(error => {
        console.log('error updating meal', error);
        res.sendStatus(500);
    })
})

//!! END PUT REQUESTS !!//

// DELETE REQUESTS //

// DELETE meal
router.delete('/:id', (req, res) => {
    const queryMeal = `DELETE FROM "meal" "ingredient" WHERE "id" = $1;`;
    console.log('in delete', req.params.id);
    pool.query(queryMeal, [req.params.id]).then(() => {
        res.sendStatus(200);
    }).catch(error => {
        console.log('error with delete request', error);
        res.sendStatus(500);
    })
})

// DELETE list
router.delete('/list/:id', (req, res) => {
    const queryText = 'DELETE FROM "list" WHERE "id" = $1';
    pool.query(queryText, [req.params.id]).then(() => {
        res.sendStatus(200);
    }).catch(error => {
        console.log('error with deleting list', error);
        res.sendStatus(500);
    })
})

// DELETE INGREDIENT FROM LIST
router.delete('/list/ingredient/:id', (req, res) => {
    const queryText = 'DELETE FROM "ingredient" WHERE "id" = $1';
    pool.query(queryText, [req.params.id]).then(() => {
        res.sendStatus(200);
    }).catch(error => {
        console.log('error with deleting ingredient from list', error);
        res.sendStatus(500);
    })
})

//!! END DELETE REQUESTS !!//

module.exports = router;