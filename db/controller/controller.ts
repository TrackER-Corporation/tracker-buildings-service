
import asyncHandler from 'express-async-handler'
import { ObjectId } from 'mongodb'
import { collections } from '../services/database.service'

// @desc    Get goals
// @route   GET /api/goals
// @access  Private
export const registerBuilding = asyncHandler(async (req: any, res: any) => {
    const { name, contact, userId, address, type, organizationId, sqft, lat, long } = req.body

    if (!name || !contact || !address || !type || !lat || !long || !organizationId || !sqft) {
        res.status(400)
        // throw new Error('Please add all fields')
    }

    // Check if building exists
    if (await collections?.buildings?.findOne({ address }))
        res.status(400)// throw new Error('Building already exists')

    // Create building
    const building: any = await collections?.buildings?.insertOne({
        name,
        contact,
        userId,
        address,
        organizationId,
        sqft,
        type,
        lat,
        long,
        resources: []
    })

    if (building) {
        const org = await collections?.buildings?.findOneAndUpdate({ _id: new ObjectId(organizationId) }, {
            "$push": {
                customers: {
                    building: building.id,
                    user: userId,
                } as any
            }
        })
        if (org)
            res.status(201).json({
                _id: building.id,
                name: building.name,
                contact: building.contact,
                userId: building.userId,
                organizationId: building.organizationId,
                sqft: building.sqft,
                address: building.address,
                type: building.type,
                lat: building.lat,
                long: building.long,
                resources: []
            })
        else {
            res.status(400)
            // throw new Error('Not Created')
        }
    } else {
        res.status(400)
        // throw new Error('Invalid building data')
    }
})

export const updateBuilding = asyncHandler(async (req: any, res: any) => {
    const building = await collections?.buildings?.findOne(req.params.id)

    if (!building) {
        res.status(400)
        // throw new Error('User not found')
    }

    // Make sure the logged in user matches the goal user
    if (building?._id.toString() !== req.params.id) {
        res.status(401)
        // throw new Error('User not authorized')
    }

    const updateBuilding = await collections?.buildings?.findOneAndUpdate({ _di: new ObjectId(req.params.id) }, req.body, {})
    res.status(200).json(updateBuilding)
})

export const updateBuildingResources = asyncHandler(async (req: any, res: any) => {
    const building = await collections?.buildings?.findOne(req.params.id)
    if (!building) {
        res.status(400)
        // throw new Error('User not found')
    }
    if (building?._id.toString() !== req.params.id) {
        res.status(401)
        // throw new Error('User not authorized')
    }

    building?.resources.push(req.body.resource)
    building?.save().
        then(() =>
            res.status(200).json(building)
        ).catch((e: string) => {
            res.status(400)
            // throw new Error(e)
        })
})

export const getBuildingsById = asyncHandler(async (req: any, res: any) => {
    let result = collections.buildings?.find({ userId: new ObjectId(req.params.id) }).toArray()
    res.status()
    if (!result) {
        res.status(400)
        // throw new Error('Goal not found')
    }
    res.status(200).json(result)

});

export const getBuilding = asyncHandler(async (req: any, res: any) => {
    const building = await collections?.buildings?.findOne({ _id: new ObjectId(req.params.id) })
    if (!building) {
        res.status(400)
        // throw new Error('Goal not found')
    }
    if (!building?._id) {
        res.status(401)
        // throw new Error('User not found')
    }
    res.status(200).json(building)
})


export const getBuildings = asyncHandler(async (req: any, res: any) => {
    const buildings = await collections?.buildings?.find().toArray();
    res.status(200).json(buildings)
})

export const getBuildingsByOrganizationId = asyncHandler(async (req: any, res: any) => {
    const building = await collections?.buildings?.find({ organizationId: new ObjectId(req.params.id) }).toArray()
    if (!building) {
        res.status(400).json([])
        // throw new Error('Goal not found')
    }
    if (!building) {
        res.status(404).json([])
        // throw new Error('Building not found')
    }
    res.status(200).json(building)
})

export const deleteBuildingById = asyncHandler(async (req: any, res: any) => {
    let myQuery = { _id: new ObjectId(req.params.id) };
    const building = await collections?.buildings?.findOne(myQuery)
    if (!building) {
        res.status(400)
        // throw new Error('Goal not found')
    }
    // Check for user
    if (!building?._id) {
        res.status(401)
        // throw new Error('User not found')
    }
    await building?.remove()
    res.status(200).json({ id: req.params.id })
})
