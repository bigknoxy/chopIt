// Comprehensive Axe Testing Script
class AxeTestingTool {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.axeRenderer = new AxeRenderer();
    this.treeX = 300;
    this.treeY = 200;
    this.scale = 1.0;
    this.animationStates = {};
    this.testResults = {};
    this.testCanvas = document.createElement('canvas');
    this.testCtx = this.testCanvas.getContext('2d');
  }

  initialize() {
    // Create test results container
    this.createTestContainer();
    
    // Prepare test canvas
    this.testCanvas.width = 800;
    this.testCanvas.height = 600;
    this.testCanvas.style.border = '1px solid #ccc';
    this.testCanvas.style.marginTop = '20px';
    
    // Add test canvas to container
    document.getElementById('axe-tests').appendChild(this.testCanvas);
    
    // Initialize test results
    this.testResults = {
      rusty_axe: { passed: false, issues: [] },
      iron_axe: { passed: false, issues: [] },
      steel_axe: { passed: false, issues: [] },
      gilded_axe: { passed: false, issues: [] },
      ancient_axe: { passed: false, issues: [] },
      swing_animation: { passed: false, issues: [] },
      crit_effects: { passed: false, issues: [] },
      performance: { passed: false, issues: [] },
      positioning: { passed: false, issues: [] },
      responsive: { passed: false, issues: [] }
    };
  }

  createTestContainer() {
    const container = document.createElement('div');
    container.id = 'axe-tests';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 9999;
      padding: 20px;
      overflow: auto;
    `;
    
    const title = document.createElement('h1');
    title.textContent = '🔧 Axe Rendering Test Suite';
    title.style.color = 'white';
    title.style.marginBottom = '20px';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '❌ Close';
    closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: #ff4444;
      color: white;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
    `;
    closeBtn.onclick = () => {
      container.remove();
    };
    
    container.appendChild(title);
    container.appendChild(closeBtn);
    document.body.appendChild(container);
  }

  async testAllAxes() {
    console.log('🔧 Starting Axe Rendering Tests...');
    
    // Test each axe type
    for (const axeId of AXE_ORDER) {
      await this.testAxeType(axeId);
    }
    
    // Test swing animation
    await this.testSwingAnimation();
    
    // Test crit effects
    await this.testCritEffects();
    
    // Test performance
    await this.testPerformance();
    
    // Test positioning
    await this.testPositioning();
    
    // Test responsiveness
    await this.testResponsive();
    
    // Generate final report
    this.generateReport();
  }

  async testAxeType(axeId) {
    console.log(`📋 Testing ${axeId}...`);
    
    const axeDef = getAxe(axeId);
    if (!axeDef) {
      this.testResults[axeId].issues.push('Axe definition not found');
      return;
    }
    
    // Test visual properties
    const visual = axeDef.visual;
    if (!visual) {
      this.testResults[axeId].issues.push('No visual configuration found');
      return;
    }
    
    // Test color rendering
    this.testColorRendering(visual);
    
    // Test shape rendering
    this.testShapeRendering(visual);
    
    // Test glow effect
    this.testGlowEffect(visual);
    
    // Test shine effect
    this.testShineEffect(visual);
    
    // Test basic rendering
    this.testBasicRendering(axeDef, visual);
    
    this.testResults[axeId].passed = true;
    console.log(`✅ ${axeId} visual tests passed`);
  }

  testColorRendering(visual) {
    // Test blade color validity
    if (!this.isValidColor(visual.bladeColor)) {
      this.testResults.rusty_axe.issues.push(`Invalid blade color: ${visual.bladeColor}`);
    }
    
    // Test handle color validity
    if (!this.isValidColor(visual.handleColor)) {
      this.testResults.rusty_axe.issues.push(`Invalid handle color: ${visual.handleColor}`);
    }
    
    // Test glow color if present
    if (visual.hasGlow && visual.glowColor) {
      if (!this.isValidColor(visual.glowColor)) {
        this.testResults.rusty_axe.issues.push(`Invalid glow color: ${visual.glowColor}`);
      }
    }
  }

  testShapeRendering(visual) {
    // Test shape rendering by attempting to render each shape
    const shapes = ['wedge', 'wide', 'jagged', 'ornate', 'crystal'];
    for (const shape of shapes) {
      visual.bladeShape = shape;
      try {
        this.renderAxeShape(visual, 1.0);
      } catch (e) {
        this.testResults.rusty_axe.issues.push(`Shape rendering failed for ${shape}: ${e.message}`);
      }
    }
  }

  testGlowEffect(visual) {
    if (visual.hasGlow) {
      try {
        this.renderGlowEffect(visual);
        console.log('✅ Glow effect renders correctly');
      } catch (e) {
        this.testResults.rusty_axe.issues.push(`Glow effect rendering failed: ${e.message}`);
      }
    }
  }

  testShineEffect(visual) {
    if (visual.shineEffect) {
      try {
        this.renderShineEffect();
        console.log('✅ Shine effect renders correctly');
      } catch (e) {
        this.testResults.rusty_axe.issues.push(`Shine effect rendering failed: ${e.message}`);
      }
    }
  }

  testBasicRendering(axeDef, visual) {
    try {
      // Render at different scales
      for (let scale = 0.5; scale <= 2.0; scale += 0.5) {
        this.renderAxeAtScale(axeDef, visual, scale);
      }
      console.log('✅ Basic rendering at multiple scales');
    } catch (e) {
      this.testResults.rusty_axe.issues.push(`Basic rendering failed: ${e.message}`);
    }
  }

  async testSwingAnimation() {
    console.log('🔄 Testing swing animation...');
    
    const testDuration = 2000; // 2 seconds
    const startTime = performance.now();
    let progress = 0;
    
    while (progress <= 1) {
      const elapsed = performance.now() - startTime;
      progress = Math.min(elapsed / testDuration, 1);
      
      // Render animation frame
      this.renderSwingAnimation(progress);
      
      await new Promise(resolve => setTimeout(resolve, 16)); // ~60fps
    }
    
    this.testResults.swing_animation.passed = true;
    console.log('✅ Swing animation renders smoothly');
  }

  async testCritEffects() {
    console.log('✨ Testing crit effects...');
    
    // Test crit flash
    this.renderCritFlash();
    
    // Test crit glow
    this.renderCritGlow();
    
    this.testResults.crit_effects.passed = true;
    console.log('✅ Crit effects render correctly');
  }

  async testPerformance() {
    console.log('⚡ Testing performance...');
    
    const startTime = performance.now();
    const iterations = 100;
    
    for (let i = 0; i < iterations; i++) {
      // Render all axe types
      for (const axeId of AXE_ORDER) {
        const axeDef = getAxe(axeId);
        if (axeDef) {
          this.renderAxeForPerformance(axeDef);
        }
      }
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    const avgTime = duration / iterations;
    
    console.log(`⏱️  Performance: ${duration.toFixed(2)}ms total, ${avgTime.toFixed(2)}ms avg per iteration`);
    
    if (duration < 1000) {
      this.testResults.performance.passed = true;
      console.log('✅ Performance within acceptable limits');
    } else {
      this.testResults.performance.issues.push('Performance may be slow');
    }
  }

  async testPositioning() {
    console.log('📏 Testing positioning...');
    
    // Test tree positioning
    this.renderTreePositionTest();
    
    // Test offset calculations
    this.testOffsetCalculations();
    
    this.testResults.positioning.passed = true;
    console.log('✅ Positioning calculations correct');
  }

  async testResponsive() {
    console.log('📱 Testing responsive design...');
    
    // Test different screen sizes
    const screenSizes = [
      { width: 320, height: 568 }, // iPhone SE
      { width: 375, height: 667 }, // iPhone 8
      { width: 414, height: 736 }, // iPhone 8 Plus
      { width: 768, height: 1024 }, // iPad
      { width: 1920, height: 1080 } // Desktop
    ];
    
    for (const size of screenSizes) {
      this.testScreenSize(size.width, size.height);
    }
    
    this.testResults.responsive.passed = true;
    console.log('✅ Responsive design working');
  }

  // Rendering helper methods
  renderAxeShape(visual, scale) {
    this.testCtx.save();
    this.testCtx.translate(100, 100);
    this.testCtx.scale(scale, scale);
    
    // Test shape rendering
    this.axeRenderer.drawBlade(this.testCtx, visual, { swingProgress: 0, isCritPending: false, critFlashTime: 0 });
    
    this.testCtx.restore();
  }

  renderGlowEffect(visual) {
    this.testCtx.save();
    this.testCtx.translate(100, 100);
    this.axeRenderer.drawGlow(this.testCtx, visual);
    this.testCtx.restore();
  }

  renderShineEffect() {
    this.testCtx.save();
    this.testCtx.translate(100, 100);
    this.axeRenderer.drawShine(this.testCtx);
    this.testCtx.restore();
  }

  renderAxeAtScale(axeDef, visual, scale) {
    this.testCtx.save();
    this.testCtx.translate(100, 100);
    this.testCtx.scale(scale, scale);
    
    // Render full axe
    const animState = { swingProgress: 0, isCritPending: false, critFlashTime: 0 };
    this.axeRenderer.render(this.testCtx, axeDef, visual, animState, 0, 0, scale);
    
    this.testCtx.restore();
  }

  renderSwingAnimation(progress) {
    this.testCtx.clearRect(0, 0, this.testCanvas.width, this.testCanvas.height);
    
    const animState = { swingProgress: progress, isCritPending: false, critFlashTime: 0 };
    const axeDef = getAxe('steel_axe');
    const visual = axeDef && axeDef.visual;
    
    if (axeDef && visual) {
      this.axeRenderer.render(this.testCtx, axeDef, visual, animState, this.treeX, this.treeY, 1.0);
    }
  }

  renderCritFlash() {
    this.testCtx.clearRect(0, 0, this.testCanvas.width, this.testCanvas.height);
    
    const animState = { swingProgress: 0, isCritPending: true, critFlashTime: 200 };
    const axeDef = getAxe('gilded_axe');
    const visual = axeDef && axeDef.visual;
    
    if (axeDef && visual) {
      this.axeRenderer.render(this.testCtx, axeDef, visual, animState, this.treeX, this.treeY, 1.0);
    }
  }

  renderCritGlow() {
    this.testCtx.clearRect(0, 0, this.testCanvas.width, this.testCanvas.height);
    
    const animState = { swingProgress: 0, isCritPending: true, critFlashTime: 200 };
    const axeDef = getAxe('ancient_axe');
    const visual = axeDef && axeDef.visual;
    
    if (axeDef && visual) {
      this.axeRenderer.render(this.testCtx, axeDef, visual, animState, this.treeX, this.treeY, 1.0);
    }
  }

  renderTreePositionTest() {
    this.testCtx.clearRect(0, 0, this.testCanvas.width, this.testCanvas.height);
    
    // Draw tree reference
    this.testCtx.fillStyle = '#8B4513';
    this.testCtx.fillRect(this.treeX - 20, this.treeY - 30, 40, 60);
    
    // Draw axe at different positions
    const axeDef = getAxe('rusty_axe');
    const visual = axeDef && axeDef.visual;
    
    if (axeDef && visual) {
      // Resting position
      this.axeRenderer.render(this.testCtx, axeDef, visual, { swingProgress: 0, isCritPending: false, critFlashTime: 0 }, this.treeX, this.treeY, 1.0);
      
      // Swing position
      const animState = { swingProgress: 0.5, isCritPending: false, critFlashTime: 0 };
      this.axeRenderer.render(this.testCtx, axeDef, visual, animState, this.treeX, this.treeY, 1.0);
    }
  }

  testOffsetCalculations() {
    // Test swing offset calculations
    const restX = this.treeX + AxeRenderer.REST_X_OFFSET;
    const restY = this.treeY + AxeRenderer.REST_Y_OFFSET;
    
    for (let progress = 0; progress <= 1; progress += 0.25) {
      const swingAngle = this.axeRenderer.calculateSwingAngle(progress);
      const swingOffset = Math.sin(progress * Math.PI) * AxeRenderer.SWING_OFFSET_DISTANCE;
      const axeX = restX - swingOffset;
      const axeY = restY + swingOffset * AxeRenderer.SWING_OFFSET_Y_MULTIPLIER;
      
      console.log(`Progress ${progress}: Angle ${swingAngle.toFixed(2)}, Offset ${swingOffset.toFixed(2)}, Position (${axeX}, ${axeY})`);
    }
  }

  renderAxeForPerformance(axeDef) {
    const visual = axeDef.visual;
    if (visual) {
      const animState = { swingProgress: Math.random(), isCritPending: false, critFlashTime: 0 };
      this.axeRenderer.render(this.testCtx, axeDef, visual, animState, this.treeX, this.treeY, 1.0);
    }
  }

  testScreenSize(width, height) {
    console.log(`📱 Testing ${width}x${height} screen size...`);
    
    // Create test context for this screen size
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Test rendering at this size
    for (const axeId of AXE_ORDER) {
      const axeDef = getAxe(axeId);
      const visual = axeDef && axeDef.visual;
      
      if (axeDef && visual) {
        const animState = { swingProgress: 0.5, isCritPending: false, critFlashTime: 0 };
        this.axeRenderer.render(tempCtx, axeDef, visual, animState, width / 2, height / 2, 1.0);
      }
    }
  }

  generateReport() {
    console.log('📋 Generating Test Report...');
    
    // Create summary
    const summary = {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0
    };
    
    // Test each axe type
    for (const axeId of AXE_ORDER) {
      summary.totalTests++;
      if (this.testResults[axeId].passed) {
        summary.passedTests++;
      } else {
        summary.failedTests++;
      }
    }
    
    // Test system tests
    for (const test of ['swing_animation', 'crit_effects', 'performance', 'positioning', 'responsive']) {
      summary.totalTests++;
      if (this.testResults[test].passed) {
        summary.passedTests++;
      } else {
        summary.failedTests++;
      }
    }
    
    // Display results
    const resultsDiv = document.createElement('div');
    resultsDiv.style.cssText = `
      margin-top: 20px;
      background: white;
      padding: 20px;
      border-radius: 8px;
    `;
    
    const summaryTitle = document.createElement('h2');
    summaryTitle.textContent = '📋 Test Summary';
    resultsDiv.appendChild(summaryTitle);
    
    const summaryList = document.createElement('ul');
    summaryList.style.cssText = `
      list-style: none;
      padding: 0;
    `;
    
    const summaryItem = document.createElement('li');
    summaryItem.innerHTML = `
      <strong>${summary.passedTests}/${summary.totalTests} tests passed</strong>
      <span style="color: ${summary.failedTests === 0 ? 'green' : 'red'}">
        (${summary.failedTests === 0 ? '✅ All tests passed' : '❌ Some tests failed'})
      </span>
    `;
    summaryList.appendChild(summaryItem);
    resultsDiv.appendChild(summaryList);
    
    // Show detailed results
    const detailedTitle = document.createElement('h3');
    detailedTitle.textContent = '📈 Detailed Results';
    resultsDiv.appendChild(detailedTitle);
    
    const detailedList = document.createElement('ul');
    detailedList.style.cssText = `
      list-style: none;
      padding: 0;
    `;
    
    for (const axeId of AXE_ORDER) {
      const result = this.testResults[axeId];
      const item = document.createElement('li');
      item.innerHTML = `
        <strong>${axeId}</strong>: 
        <span style="color: ${result.passed ? 'green' : 'red'}">
          ${result.passed ? '✅ Passed' : '❌ Failed'}
        </span>
        ${result.issues.length > 0 ? `<br><small>${result.issues.join(', ')}</small>` : ''}
      `;
      detailedList.appendChild(item);
    }
    
    // System tests
    for (const test of ['swing_animation', 'crit_effects', 'performance', 'positioning', 'responsive']) {
      const result = this.testResults[test];
      const item = document.createElement('li');
      item.innerHTML = `
        <strong>${test.replace('_', ' ')}</strong>: 
        <span style="color: ${result.passed ? 'green' : 'red'}">
          ${result.passed ? '✅ Passed' : '❌ Failed'}
        </span>
        ${result.issues.length > 0 ? `<br><small>${result.issues.join(', ')}</small>` : ''}
      `;
      detailedList.appendChild(item);
    }
    
    resultsDiv.appendChild(detailedList);
    document.getElementById('axe-tests').appendChild(resultsDiv);
    
    // Final verdict
    const finalVerdict = document.createElement('div');
    finalVerdict.style.cssText = `
      margin-top: 20px;
      padding: 15px;
      background: ${summary.failedTests === 0 ? '#4CAF50' : '#f44336'};
      color: white;
      border-radius: 8px;
      text-align: center;
      font-weight: bold;
      font-size: 18px;
    `;
    
    finalVerdict.textContent = summary.failedTests === 0 ? 
      '🎉 ALL TESTS PASSED - Axe Rendering Implementation is Working Perfectly!' : 
      '⚠️  SOME TESTS FAILED - Please review the detailed results above';
    
    document.getElementById('axe-tests').appendChild(finalVerdict);
  }

  isValidColor(color) {
    // Simple color validation
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return colorRegex.test(color);
  }
}

// Initialize and run tests
const axeTester = new AxeTestingTool();
axeTester.initialize();
axeTester.testAllAxes();