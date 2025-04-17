const { fetchActivePopup, fetchAllPopups, createPopup, editPopup, activatePopup, deactivatePopup, deletePopup } = require('../db/functions.js')

async function newPopup (req, res) {
    try {
        const { title, content, navigation } = req.body

        const newPopup =  await createPopup({title, content, navigation})

        if (!newPopup) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Error ocurred while creating popup'
            })
        }

        return res.status(201).json({
            status: 'Created',
            message: 'Successfully created Popup'
        })

    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            err: err
        })
    }
}

async function removePopup (req, res) {
    try {

        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                status: 'Failed',
                message: 'No Id found'
            })
        }

        const popup_to_be_deleted = await deletePopup(id)
        
        if (popup_to_be_deleted == 'Invalid Id') {
            return res.status(404).json({
                status: 'Not found',
                message: 'Invalid Id'
            })
        }

        return res.status(200).json({
            status: 'Ok',
            message: 'Popup deleted'
        })

    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            err: err
        })
    }
}

async function popupActivate (req, res) {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                status: 'Failed',
                message: 'No Id found'
            })
        }

        const popup_to_be_activated = await activatePopup(id)
        
        if (popup_to_be_activated == 'Invalid Id') {
            return res.status(404).json({
                status: 'Not found',
                message: 'Invalid Id'
            })
        }

        return res.status(200).json({
            status: 'Ok',
            message: 'Popup activated'
        })
    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            err: err
        })
    }
}

async function popupDeactivate (req, res) {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                status: 'Failed',
                message: 'No Id found'
            })
        }

        const popup_to_be_activated = await deactivatePopup(id)
        
        if (popup_to_be_activated == 'Invalid Id') {
            return res.status(404).json({
                status: 'Not found',
                message: 'Invalid Id'
            })
        }

        return res.status(200).json({
            status: 'Ok',
            message: 'Popup deactivated'
        })
    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            err: err
        })
    }
}


async function allPopups (req, res) {
    try {
        const result = await fetchAllPopups()

        return res.status(200).json({
            status: 'Ok',
            data: result
        })
    } catch (err) {
        return res.status(500).json({
            status: 'Failed',
            err: err
        })
    }
}

async function getActivePopup (req, res) {
    try {

        const activePopup = await fetchActivePopup()

        if (!activePopup) {
            return res.status(200).json({
                status: 'Ok',
                data: ''
            })
        }

        return res.status(200).json({
            status: 'Ok',
            data: activePopup
        })

    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            err: err
        })
    }
}

async function popupEdit (req, res) {
    try {
        const { id } = req.params
        const { title, content, navigation } = req.body

        if (!id || !title || !content) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Incomplete data'
            })
        }

        const popup_to_edit = await editPopup(id, {title, content, navigation})
        
        if (popup_to_edit == 'Invalid Id') {
            return res.status(400).json({
                status: 'Failed',
                message: 'Invalid Id'
            })
        }

        return res.status(200).json({
            status: 'Ok',
            message: 'Successfully edited popup'
        })
        
    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            err: err
        })
    }
}

module.exports = {
    newPopup,
    removePopup,
    popupActivate,
    popupDeactivate,
    getActivePopup,
    popupEdit,
    allPopups
}