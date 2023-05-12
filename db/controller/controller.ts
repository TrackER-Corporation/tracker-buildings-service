
import asyncHandler from 'express-async-handler'
import { ObjectId } from 'mongodb'
import { collections } from '../services/database.service'


export const getBuilding = asyncHandler(async (req: any, res: any) => {
    const building = await collections?.buildings?.findOne({ _id: new ObjectId(req.params.id) })
    if (!building) throw new Error('Error')
    res.status(200).json(building)
})


export const getBuildings = asyncHandler(async (req: any, res: any) => {
    const buildings = await collections?.buildings?.find().toArray();
    if (buildings?.length === 0) throw new Error('Error')
    res.status(200).json(buildings)
})

export const getBuildingByUserId = asyncHandler(async (req: any, res: any) => {
    let result = await collections.buildings?.find({ userId: new ObjectId(req.params.id) }).toArray()
    if (!result || result?.length === 0) {
        throw new Error('Error')
    } else {
        res.status(200).json(result)
    }
});

export const getBuildingsByOrganizationId = asyncHandler(async (req: any, res: any) => {
    const building = await collections?.buildings?.find({ organizationId: new ObjectId(req.params.id) }).toArray()
    if (!building) throw new Error('Error')
    res.status(200).json(building)
})


export const registerBuilding = asyncHandler(async (req: any, res: any) => {
    const { name, contact, userId, address, type, organizationId, sqft, lat, long } = req.body

    if (!name || !contact || !address || !type || !lat || !long || !organizationId || !sqft) {
        throw new Error('Error')
    }

    collections.buildings?.findOne({ address }).catch(() => {
        throw new Error('Error')
    })


    await collections?.buildings?.insertOne({
        name,
        contact,
        userId: new ObjectId(userId),
        address,
        organizationId: new ObjectId(organizationId),
        sqft,
        type,
        lat,
        long,
        resources: []
    }).then(async (building: any) => {
        const response = await fetch(`http://localhost:3000/api/organization/${organizationId}`)
        var data = await response.json()

        data.customers.push({
            building: building.insertedId,
            user: userId,
        })

        const update = await fetch(`http://localhost:3000/api/organization/${organizationId}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const updateResponse = await update.json();


        if (updateResponse)
            res.status(201).json({
                _id: building.insertedId,
                name: name,
                contact: contact,
                userId: userId,
                organizationId: organizationId,
                sqft: sqft,
                address: address,
                type: type,
                lat: lat,
                long: long,
                resources: []
            })
        else
            throw new Error('Error')
    }).catch(() => { throw new Error('Error') })

})

export const updateBuilding = asyncHandler(async (req: any, res: any) => {
    const building = await collections?.buildings?.findOne(new ObjectId(req.params.id))
    if (!building) throw new Error('Error')

    const data = req.body

    const updateBuilding = await collections?.buildings?.findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: { ...data } },
        { returnDocument: 'after' })
    res.status(200).json(updateBuilding?.value)
})

export const updateBuildingResources = asyncHandler(async (req: any, res: any) => {
    const building = await collections?.buildings?.findOne(req.params.id)
    if (!building) {
        throw new Error('Error')
    }

    building?.resources.push(req.body.resource)
    building?.save().
        then(() =>
            res.status(200).json(building)
        ).catch(() => {
            throw new Error("Error")
        })
})


export const deleteBuildingById = asyncHandler(async (req: any, res: any) => {
    let myQuery = { _id: new ObjectId(req.params.id) };
    const building = await collections?.buildings?.deleteOne(myQuery)
    if (!building) throw new Error('Error')
    res.status(200).json({ id: req.params.id })
})

export const deleteBuildingByUserId = asyncHandler(async (req: any, res: any) => {
    await collections?.buildings?.deleteMany({ userId: new ObjectId(req.params.id) })
    res.status(200)
})
