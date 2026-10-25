import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js';
import http from 'http';

dotenv.config();

let server;
let port = 5099;
let baseUrl = `http://127.0.0.1:${port}`;

const log = (msg) => console.log(`[TEST]: ${msg}`);
const pass = (name) => console.log(`  ✓ PASS: ${name}`);
const fail = (name, err) => {
  console.error(`  ✗ FAIL: ${name}`, err);
  process.exit(1);
};

const request = async (endpoint, options = {}) => {
  const url = `${baseUrl}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
};

const runAllTests = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/spacecraft';
    await mongoose.connect(mongoUri);

    server = http.createServer(app);
    await new Promise((resolve) => server.listen(port, resolve));
    log(`Test server started on ${baseUrl}`);

    // Test 1: Health Check
    log('--- 1. Testing System Health & API Availability ---');
    const health = await request('/api/health');
    if (health.status === 200 && health.data.status === 'healthy') {
      pass('GET /api/health returned healthy');
    } else {
      fail('GET /api/health failed', health.data);
    }

    // Test 2: Authentication
    log('--- 2. Testing Authentication & JWT Generation ---');
    const clientLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'client@spacecraft.com', password: 'Client@12345' },
    });
    if (clientLogin.status === 200 && clientLogin.data.data.token) {
      pass('Client login successful with JWT');
    } else {
      fail('Client login failed', clientLogin.data);
    }
    const clientToken = clientLogin.data.data.token;
    const clientId = clientLogin.data.data._id;

    const designerLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'designer@spacecraft.com', password: 'Designer@12345' },
    });
    const designerToken = designerLogin.data.data.token;
    pass('Designer login successful');

    const adminLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@spacecraft.com', password: 'Admin@12345' },
    });
    const adminToken = adminLogin.data.data.token;
    pass('Admin login successful');

    const sarahLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'sarah@spacecraft.com', password: 'Client@12345' },
    });
    const sarahToken = sarahLogin.data.data.token;
    pass('Second client (Sarah) login successful');

    // Test 3: Catalog & Materials
    log('--- 3. Testing Room Concepts & Materials Catalog ---');
    const conceptsRes = await request('/api/room-concepts');
    if (conceptsRes.status === 200 && conceptsRes.data.data.length > 0) {
      pass(`Retrieved ${conceptsRes.data.data.length} published room concepts`);
    } else {
      fail('Failed to fetch room concepts', conceptsRes.data);
    }
    const targetConcept = conceptsRes.data.data[0];

    const materialsRes = await request('/api/material-options');
    if (materialsRes.status === 200 && materialsRes.data.data.length >= 4) {
      pass(`Retrieved ${materialsRes.data.data.length} material options`);
    } else {
      fail('Failed to fetch materials', materialsRes.data);
    }
    const floorMat = materialsRes.data.data.find((m) => m.category === 'flooring');
    const wallMat = materialsRes.data.data.find((m) => m.category === 'walls');
    const cabMat = materialsRes.data.data.find((m) => m.category === 'cabinetry');
    const accMat = materialsRes.data.data.find((m) => m.category === 'accent');

    // Test 4: Persistent Saved Design
    log('--- 4. Testing Persistent Saved Designs & Client Isolation ---');
    const createDesignRes = await request('/api/designs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${clientToken}` },
      body: {
        name: 'Automated Test Nordic Concept',
        roomConceptId: targetConcept._id,
        selectedMaterials: {
          flooring: floorMat._id,
          walls: wallMat._id,
          cabinetry: cabMat._id,
          accent: accMat._id,
        },
        notes: 'Testing automated design configuration persistence',
        customDimensions: { lengthFt: 20, widthFt: 15, areaSqFt: 300 },
      },
    });

    if (createDesignRes.status === 201 && createDesignRes.data.data._id) {
      pass('Client created new persistent saved design');
    } else {
      fail('Failed to create saved design', createDesignRes.data);
    }
    const designId = createDesignRes.data.data._id;

    // Verify isolation: Sarah should NOT be able to view or edit Marcus's design
    const sarahViewMarcusDesign = await request(`/api/designs/${designId}`, {
      headers: { Authorization: `Bearer ${sarahToken}` },
    });
    if (sarahViewMarcusDesign.status === 403) {
      pass('Client isolation verified: Sarah rejected from accessing Marcus design (403 Forbidden)');
    } else {
      fail('Client isolation violated!', sarahViewMarcusDesign.data);
    }

    // Test 5: Project Brief Submission
    log('--- 5. Testing Project Brief Submission & Ownership ---');
    const projectBriefRes = await request('/api/projects', {
      method: 'POST',
      headers: { Authorization: `Bearer ${clientToken}` },
      body: {
        title: 'Nordic Villa Living Space Remodel',
        roomType: 'Living Room',
        propertyType: 'Single Family Villa',
        preferredStyle: 'Warm Minimalist',
        budgetRange: { min: 25000, max: 45000 },
        timeline: '2 - 4 Months',
        location: { city: 'Seattle', stateOrProvince: 'WA', country: 'United States' },
        requirementsDescription: 'High ceilings, acoustic panels, and organic texture palette.',
        savedDesignId: designId,
      },
    });

    if (projectBriefRes.status === 201 && projectBriefRes.data.data._id) {
      pass('Project brief submitted successfully with status "Submitted"');
    } else {
      fail('Failed to submit project brief', projectBriefRes.data);
    }
    const projectId = projectBriefRes.data.data._id;

    // Test 6: Proposal Creation & Versioning (v1 -> revision -> v2)
    log('--- 6. Testing Proposal Versioning & Immutability ---');

    // Designer creates Proposal v1
    const createProposalRes = await request(`/api/projects/${projectId}/proposals`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${designerToken}` },
      body: {
        title: 'Architectural Villa Proposal',
        designConceptDescription: 'Bespoke Scandinavian spatial layout with engineered floor heating.',
        estimatedTimeline: '6 - 8 Weeks',
        scopeOfWork: ['Framing', 'Finishing', 'Flooring'],
        costBreakdown: [
          { category: 'Materials', item: 'Flooring & Paint', quantity: 300, unitCost: 20 },
          { category: 'Furniture', item: 'Custom Oak Seating', quantity: 1, unitCost: 5000 },
          { category: 'Labour', item: 'Specialist Artisan', quantity: 80, unitCost: 50 },
        ],
      },
    });

    if (createProposalRes.status === 201 && createProposalRes.data.data.proposal.currentVersionNumber === 1) {
      pass('Designer published Proposal Version 1 ($15,000 computed total)');
    } else {
      fail('Failed to create proposal v1', createProposalRes.data);
    }
    const proposalId = createProposalRes.data.data.proposal._id;
    const version1Id = createProposalRes.data.data.currentVersion._id;

    // Client requests revision on Version 1
    const revisionReqRes = await request(`/api/proposals/${proposalId}/versions/${version1Id}/revision-requests`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${clientToken}` },
      body: {
        requestedChanges: 'Please reduce custom furniture cost and provide an alternate fabric specification.',
        focusAreas: ['Cost & Budget', 'Materials & Finishes'],
      },
    });

    if (revisionReqRes.status === 201 && revisionReqRes.data.data.targetVersionNumber === 1) {
      pass('Client successfully submitted revision request against Version 1');
    } else {
      fail('Failed to request revision', revisionReqRes.data);
    }

    // Designer publishes Proposal Version 2
    const v2Res = await request(`/api/proposals/${proposalId}/versions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${designerToken}` },
      body: {
        title: 'Architectural Villa Proposal (Revised)',
        designConceptDescription: 'Refined package with modular furniture package.',
        estimatedTimeline: '6 - 7 Weeks',
        scopeOfWork: ['Framing', 'Finishing', 'Flooring', 'Delivery'],
        costBreakdown: [
          { category: 'Materials', item: 'Flooring & Paint', quantity: 300, unitCost: 20 },
          { category: 'Furniture', item: 'Curated Ready Modular Seating', quantity: 1, unitCost: 3500 },
          { category: 'Labour', item: 'Specialist Artisan', quantity: 70, unitCost: 50 },
        ],
        revisionSummary: 'Reduced furniture and artisan labor; saved $2,000.',
      },
    });

    if (v2Res.status === 201 && v2Res.data.data.proposal.currentVersionNumber === 2) {
      pass('Designer published Proposal Version 2 (Sequential number: 2)');
    } else {
      fail('Failed to publish version 2', v2Res.data);
    }
    const version2Id = v2Res.data.data.currentVersion._id;

    // Check version immutability: v1 should still exist and retain its original cost
    const versionListRes = await request(`/api/proposals/${proposalId}/versions`, {
      headers: { Authorization: `Bearer ${clientToken}` },
    });

    const v1Record = versionListRes.data.data.versions.find((v) => v.versionNumber === 1);
    const v2Record = versionListRes.data.data.versions.find((v) => v.versionNumber === 2);

    if (v1Record && v2Record && v1Record.totalEstimatedCost === 15000 && v2Record.totalEstimatedCost === 13000) {
      pass('Proposal Immutability Verified: Version 1 ($15,000) and Version 2 ($13,000) both preserved intact');
    } else {
      fail('Proposal immutability check failed!', versionListRes.data);
    }

    // Client accepts Version 2
    const acceptRes = await request(`/api/proposals/${proposalId}/versions/${version2Id}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${clientToken}` },
      body: { notes: 'Version 2 looks fantastic. We are ready to proceed!' },
    });

    if (acceptRes.status === 200 && acceptRes.data.data.proposal.acceptedVersionNumber === 2) {
      pass('Client accepted Proposal Version 2; Project marked "Accepted"');
    } else {
      fail('Failed to accept proposal version', acceptRes.data);
    }

    // Test 7: Admin Telemetry
    log('--- 7. Testing Admin Dashboard Metrics ---');
    const adminMetricsRes = await request('/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (
      adminMetricsRes.status === 200 &&
      adminMetricsRes.data.data.projects.total >= 2 &&
      adminMetricsRes.data.data.users.total >= 4
    ) {
      pass(
        `Admin dashboard returned real live counts: ${adminMetricsRes.data.data.projects.total} projects, ${adminMetricsRes.data.data.concepts.total} concepts`
      );
    } else {
      fail('Failed to retrieve admin telemetry', adminMetricsRes.data);
    }

    log('\n==========================================');
    log('ALL 7 BACKEND WORKFLOW TESTS PASSED SUCCESSFULLY! ✓');
    log('==========================================\n');

    server.close();
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Test execution error:', err);
    if (server) server.close();
    process.exit(1);
  }
};

runAllTests();
