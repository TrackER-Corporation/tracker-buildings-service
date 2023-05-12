import express from 'express';
const router = express.Router();
import { registerBuilding, getBuilding, deleteBuildingById, getBuildingByUserId, getBuildings, updateBuilding, getBuildingsByOrganizationId, updateBuildingResources, deleteBuildingByUserId } from '../controller/controller';

router.get('/', getBuildings)
router.get('/:id', getBuilding)
router.get('/user/:id', getBuildingByUserId)
router.get('/organization/:id', getBuildingsByOrganizationId)
router.post('/register', registerBuilding)
router.put('/:id', updateBuilding)
router.put('/resources/:id', updateBuildingResources)
router.delete('/:id', deleteBuildingById)
router.delete('/user/:id', deleteBuildingByUserId)
export default router;