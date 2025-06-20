import express from 'express';
import { sendError, sendSuccess } from './common/responses/apiResponse';

const router = express.Router();

/**
 * GET /api/integrations - Get available integrations
 */
router.get('/', async (req, res) => {
  try {
    const integrations = [
      {
        id: 'jira',
        name: 'Jira Integration',
        description: 'Connect with Jira for issue tracking and project management',
        status: 'available',
        configured: false
      },
      {
        id: 'iris-2025',
        name: 'IRIS 2025 Benchmarks',
        description: 'Industry risk intelligence and benchmarking data',
        status: 'active',
        configured: true
      },
      {
        id: 'openai',
        name: 'OpenAI Integration',
        description: 'AI-powered risk analysis and recommendations',
        status: 'available',
        configured: false
      },
      {
        id: 'vulnerability-scanner',
        name: 'Vulnerability Scanner',
        description: 'Automated vulnerability assessment integration',
        status: 'available',
        configured: false
      }
    ];
    sendSuccess(res, integrations);
  } catch (error) {
    console.error('Error fetching integrations:', error);
    sendError(res, 'Failed to fetch integrations', 500);
  }
});

/**
 * GET /api/integrations/:id - Get integration details
 */
router.get('/:id', async (req, res) => {
  try {
    const integrationId = req.params.id;
    
    // Mock integration details for now
    const integration = {
      id: integrationId,
      name: `${integrationId.charAt(0).toUpperCase() + integrationId.slice(1)} Integration`,
      status: integrationId === 'iris-2025' ? 'active' : 'available',
      configured: integrationId === 'iris-2025',
      settings: {},
      lastSync: integrationId === 'iris-2025' ? new Date().toISOString() : null
    };
    
    sendSuccess(res, integration);
  } catch (error) {
    console.error('Error fetching integration:', error);
    sendError(res, 'Failed to fetch integration', 500);
  }
});

/**
 * POST /api/integrations/:id/configure - Configure integration
 */
router.post('/:id/configure', async (req, res) => {
  try {
    const integrationId = req.params.id;
    const settings = req.body;
    
    // Mock configuration response
    const result = {
      id: integrationId,
      configured: true,
      settings: settings,
      message: `${integrationId} integration configured successfully`
    };
    
    sendSuccess(res, result);
  } catch (error) {
    console.error('Error configuring integration:', error);
    sendError(res, 'Failed to configure integration', 500);
  }
});

export default router;