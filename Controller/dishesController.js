const asyncHandler = require('express-async-handler');
const DishesModel = require('../Model/DishesModel');

// POST - Create a new dish

exports.postDishes = asyncHandler(async (req, res) => {
    const {
        price,
        dishes,
        category,
        description,
        Itemnumber,
        weight,
        purity,
        details,
        subcategory
    } = req.body;

    const files = req.files;
    const image = files.map(file => file.filename);

    try {
        // Create a new dish and store it in the database
        const newDish = await DishesModel.create({
            price,
            dishes,
            category,
            description,
            Itemnumber,
            weight,
            purity,
            details,
            image,
            subcategory
        });

        // Send a response back with the created dish including its ID
        res.status(200).json({
            message: 'Dish posted successfully',
            dish: newDish // This includes the ID and all fields
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while posting the dish');
    }
});

// exports.postDishes = asyncHandler(async (req, res) => {
//     const { price, dishes, category, description, Itemnumber, ram, internalstorage, features, color, subcategory } = req.body;
//     const files = req.files;
//     const image = files.map(file => file.filename);

//     try {
//         const newDish = await DishesModel.create({
//             price,
//             dishes,
//             category,
//             description,
//             Itemnumber,
//             ram,
//             internalstorage,
//             features,
//             color,
//             image,
//             subcategory // Add subcategory to the create operation
//         });

//         res.status(200).json({
//             message: 'Dish posted successfully',
//             dish: newDish
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('An error occurred while posting the dish');
//     }
// });


// GET - Fetch all dishes
exports.getDishes = asyncHandler(async (req, res) => {
    const { search, category, subcategory, newArrivals } = req.query;

    try {
        let query = {};

        if (search) {
            query.dishes = { $regex: search, $options: 'i' };
        }

        if (category) {
            query.category = category;
        }

        if (subcategory) {
            query.subcategory = subcategory;
        }

        let response;
        if (newArrivals === 'true') {
            response = await DishesModel.find(query)
                .populate('category')
                .populate('subcategory')
                .sort({ createdAt: -1 }) // Sort by createdAt in descending order
                .exec();
        } else {
            response = await DishesModel.find(query)
                .populate('category')
                .populate('subcategory')
                .exec();
        }

        res.status(200).json(response);
    } catch (err) {
        console.error('Error fetching dishes:', err);
        res.status(500).send('An error occurred while fetching data');
    }
});

// exports.getDishes = asyncHandler(async (req, res) => {
//     const { search, category, subcategory } = req.query;

//     try {
//         let query = {};

//         if (search) {
//             query.dishes = { $regex: search, $options: 'i' };
//         }

//         if (category) {
//             query.category = category;
//         }

//         if (subcategory) {
//             query.subcategory = subcategory;
//         }

//         const response = await DishesModel.find(query)
//             .populate('category')
//             .populate('subcategory') // Populate 'subcategory' field
//             .exec();

//         res.status(200).json(response);
//     } catch (err) {
//         console.error('Error fetching dishes:', err);
//         res.status(500).send('An error occurred while fetching data');
//     }
// });


exports.getDishesById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        // Validate ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid ID format'
            });
        }

        // Find the dish by ID and populate related fields
        const dish = await DishesModel.findById(id)
            .populate('category')
            .populate('subcategory');

        // Check if dish exists
        if (!dish) {
            return res.status(404).json({ 
                success: false, 
                message: 'Dish not found'
            });
        }

        // Return the dish data
        res.status(200).json({
            success: true,
            data: dish
        });

    } catch (err) {
        console.error('Error fetching dish by ID:', err);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred while fetching the dish',
            error: err.message
        });
    }
});

// PUT - Update a dish by ID
exports.putDishesById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { price, dishes, category, description, Itemnumber, weight, purity, details, subcategory } = req.body;
    const files = req.files || [];
    const image = files.map(file => file.filename);

    try {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            console.error('Invalid ID format.');
            return res.status(400).json({ err: 'Invalid ID format.' });
        }

        const dish = await DishesModel.findById(id);
        if (!dish) {
            console.error('Dish not found.');
            return res.status(404).json({ err: 'Dish not found.' });
        }

        const update = {
            price,
            dishes,
            category,
            description,
            Itemnumber,
            details,
            weight,
            purity,
            subcategory, // Ensure 'subcategory' is included in the update
            ...(files.length && { image })
        };

        const updatedData = await DishesModel.findByIdAndUpdate(id, { $set: update }, { new: true });
        res.status(200).json(updatedData);
    } catch (err) {
        console.error('Error while updating data:', err);
        res.status(500).json({ err: 'Error while updating data', message: err.message });
    }
});


// DELETE - Delete a dish by ID
exports.deleteDishesById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const response = await DishesModel.findByIdAndDelete(id);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'An error occurred while deleting data' });
    }
});


exports.countDishes = asyncHandler(async (req, res) => {
    try {
        const count = await DishesModel.countDocuments();
        res.status(200).json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while counting dishes');
    }
});



// //new
// const asyncHandler = require('express-async-handler');
// const DishesModel = require('../Model/DishesModel');

// exports.postDishes = asyncHandler(async (req, res) => {
//     const { price, dishes, category, description, Itemnumber, ram, internalstorage, features, color } = req.body;
//     const files = req.files;
//     const image = files.map((file)=>file.filename)   
//     try {
//         const newDish = await DishesModel.create({
//             price,
//             dishes,
//             category, // Ensure 'category' is correctly received
//             description,
//             Itemnumber,
//             ram,
//             internalstorage,
//             features,
//             color,
//             image
//         });

//         res.status(200).json({
//             message: 'Dish posted successfully',
//             dish: newDish
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('An error occurred while posting the dish');
//     }
// });


// exports.getDishes = async (req, res) => {
//     const { search, category } = req.query;

//     try {
//         let query = {};

//         if (search) {
//             query.dishes = { $regex: search, $options: 'i' };
//         }

//         if (category) {
//             query.category = category;
//         }

//         const response = await DishesModel.find(query)
//             .populate({
//                 path: 'category',
//                 populate: {
//                     path: 'maincategoriesData',
//                     model: 'MaincategoriesData'
//                 }
//             })
//             .exec();

//         // Log the response to ensure the data structure is correct
//         console.log('Dishes response:', response);

//         res.status(200).json(response);
//     } catch (err) {
//         console.error('Error fetching dishes:', err);
//         res.status(500).send('An error occurred while fetching data');
//     }
// };






// exports.getDishesById = asyncHandler(async (req, res) => {
//     const { id } = req.params;

//     try {
//         const response = await DishesModel.findById(id);
//         res.status(200).json(response);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('An error occurred while fetching data');
//     }
// });

// exports.putDishesById = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const { price, dishes, category, description, Itemnumber, ram, internalstorage, features, color } = req.body;
  
//     console.log('Received category:', category); // Debug line
  
//     // Process files if present
//     const files = req.files || [];
//     const image = files.map(file => file.filename);
  
//     try {
//       if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//         console.error('Invalid ID format.');
//         return res.status(400).json({ err: 'Invalid ID format.' });
//       }
  
//       // Check if the dish exists
//       const dish = await DishesModel.findById(id);
//       if (!dish) {
//         console.error('Dish not found.');
//         return res.status(404).json({ err: 'Dish not found.' });
//       }
  
//       const update = {
//         price,
//         dishes,
//         category, // Validate this field
//         description,
//         Itemnumber,
//         ram,
//         internalstorage,
//         features,
//         color,
//         ...(files.length && { image })
//       };
  
//       const updatedData = await DishesModel.findByIdAndUpdate(id, { $set: update }, { new: true });
//       res.status(200).json(updatedData);
//     } catch (err) {
//       console.error('Error while updating data:', err);
//       res.status(500).json({ err: 'Error while updating data', message: err.message });
//     }
//   });



// exports.deleteDishesById = asyncHandler(async (req, res) => {
//     const { id } = req.params;

//     try {
//         const response = await DishesModel.findByIdAndDelete(id);
//         res.status(200).json(response);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ err: 'An error occurred while deleting data' });
//     }
// });




