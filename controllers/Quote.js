const { getAllQuotes, getQuote, editQuoteStat, addQuote, deleteQuote  } = require('../db/functions.js')

async function allQuotes (req, res) {
    try {
        
        const quotes = await getAllQuotes()

        return res.status(200).json({
            status: 'OK',
            data: quotes
        })
    } catch (err) {
        return res.status(500).json({
            status: 'Failed',
            err: err
        })
    }
}


async function quote (req, res) {
    try {

        const { id } = req.params
        
        const quote = await getQuote(id)

        if (quote == 'Invalid Id') {
            return res.status(404).json({
                status: 'Not Found',
                message: 'Invalid id'
            })
        }

        return res.status(200).json({
            status: 'OK',
            data: quote
        })
    } catch (err) {
        return res.status(500).json({
            status: 'Failed',
            err: err
        })
    }
}

async function createQuote (req, res) {
    try {

        const { businessType, wasteType, frequency, location, name, email, phone } = req.body

        if (!businessType && !wasteType && !frequency && !location && !name && !email && !phone) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Incomplete data'
            })
        }

        const newQuote = await addQuote({ businessType, wasteType, frequency, location, name, email, phone })

        if (!newQuote) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Error adding a quote'
            })
        }

        return res.status(201).json({
            status: 'Created',
            message: 'Quote added successfully'
        })

        
    } catch (err) {
        return res.status(500).json({
            status: 'Failed',
            err: err
        })
    }
} 


async function editQuote (req, res) {
    try {

        const {id} = req.params
        const { status } = req.body


        const edit = await editQuoteStat(id, status)

        if (edit == 'Invalid Id') {
            return res.status(404).json({
                status: 'Not Found',
                message: 'Invalid id'
            })
        }

        return res.status(200).json({
            status: 'Success',
            message: 'Edited status'
        })

    } catch (err) {
        return res.status(500).json({
            status: 'Failed',
            err: err
        })
    }
}

async function removeQuote(req, res) {
    try {

        const {id} = req.params


        const edit = await deleteQuote(id)

        if (edit == 'Invalid Id') {
            return res.status(404).json({
                status: 'Not Found',
                message: 'Invalid id'
            })
        }

        return res.status(200).json({
            status: 'Success',
            message: 'Deleted quote'
        })

    } catch (err) {
        return res.status(500).json({
            status: 'Failed',
            err: err
        })
    }
}

module.exports = {
    allQuotes,
    quote,
    createQuote,
    editQuote,
    removeQuote
}