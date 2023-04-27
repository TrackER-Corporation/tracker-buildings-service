import express from 'express';
const router = express.Router();
import { registerBuilding, getBuildingsById, deleteBuildingById, getBuilding, getBuildings, updateBuilding, getBuildingsByOrganizationId, updateBuildingResources } from '../controller/controller';

// router.get('/:id', getBuildingsById)
router.get('/:id', getBuilding)
router.get('/', getBuildings)
router.get('/organization/:id', getBuildingsByOrganizationId)
router.post('/register', registerBuilding)
router.put('/:id', updateBuilding)
router.put('/resources/:id', updateBuildingResources)
router.delete('/:id', deleteBuildingById)
export default router;