// 视觉回归测试框架 - 用于检测UI组件的视觉变化
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @tags: 测试,视觉回归,UI测试

export interface VisualRegressionOptions {
  threshold?: number
  diffColor?: string
  diffOpacity?: number
  ignoreAreas?: Array<{ x: number; y: number; width: number; height: number }>
}

export interface VisualRegressionResult {
  passed: boolean
  diffPixels: number
  totalPixels: number
  diffPercentage: number
  diffImage?: string
  baselineImage?: string
  currentImage?: string
}

export interface ScreenshotOptions {
  width?: number
  height?: number
  deviceScaleFactor?: number
  fullPage?: boolean
  clip?: { x: number; y: number; width: number; height: number }
}

export class VisualRegressionTester {
  private baselineDir: string
  private currentDir: string
  private diffDir: string
  private defaultOptions: VisualRegressionOptions

  constructor(
    baselineDir: string = "./screenshots/baseline",
    currentDir: string = "./screenshots/current",
    diffDir: string = "./screenshots/diff",
    options: VisualRegressionOptions = {}
  ) {
    this.baselineDir = baselineDir
    this.currentDir = currentDir
    this.diffDir = diffDir
    this.defaultOptions = {
      threshold: 0.1,
      diffColor: "#FF0000",
      diffOpacity: 0.5,
      ...options,
    }
  }

  public async compareImages(
    baselineImage: string,
    currentImage: string,
    options?: VisualRegressionOptions
  ): Promise<VisualRegressionResult> {
    const opts = { ...this.defaultOptions, ...options }

    const baselineData = await this.loadImage(baselineImage)
    const currentData = await this.loadImage(currentImage)

    if (baselineData.width !== currentData.width || baselineData.height !== currentData.height) {
      return {
        passed: false,
        diffPixels: 0,
        totalPixels: baselineData.width * baselineData.height,
        diffPercentage: 100,
        baselineImage,
        currentImage,
      }
    }

    const diffResult = this.compareImageData(baselineData, currentData, opts)

    return {
      passed: diffResult.diffPercentage <= opts.threshold!,
      diffPixels: diffResult.diffPixels,
      totalPixels: diffResult.totalPixels,
      diffPercentage: diffResult.diffPercentage,
      baselineImage,
      currentImage,
      diffImage: diffResult.diffImage,
    }
  }

  public async captureScreenshot(
    element: HTMLElement,
    filename: string,
    options?: ScreenshotOptions
  ): Promise<string> {
    const opts = {
      width: 1024,
      height: 768,
      deviceScaleFactor: 1,
      fullPage: false,
      ...options,
    }

    const canvas = document.createElement("canvas")
    canvas.width = opts.width!
    canvas.height = opts.height!
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      throw new Error("Failed to get canvas context")
    }

    const html2canvas = await this.loadHtml2Canvas()
    const renderedCanvas = await html2canvas(element, {
      width: opts.width,
      height: opts.height,
      scale: opts.deviceScaleFactor,
      logging: false,
    })

    ctx.drawImage(renderedCanvas, 0, 0)

    const imageData = canvas.toDataURL("image/png")
    return imageData
  }

  public async updateBaseline(
    testName: string,
    currentImage: string
  ): Promise<void> {
    const baselinePath = `${this.baselineDir}/${testName}.png`
    await this.saveImage(baselinePath, currentImage)
  }

  public async runVisualRegressionTest(
    testName: string,
    element: HTMLElement,
    options?: VisualRegressionOptions & ScreenshotOptions
  ): Promise<VisualRegressionResult> {
    const baselinePath = `${this.baselineDir}/${testName}.png`
    const currentPath = `${this.currentDir}/${testName}.png`

    const currentImage = await this.captureScreenshot(element, testName, options)
    await this.saveImage(currentPath, currentImage)

    try {
      const baselineImage = await this.loadImage(baselinePath)
      const result = await this.compareImages(baselinePath, currentPath, options)

      if (!result.passed) {
        const diffPath = `${this.diffDir}/${testName}.png`
        if (result.diffImage) {
          await this.saveImage(diffPath, result.diffImage)
        }
      }

      return result
    } catch (error) {
      return {
        passed: false,
        diffPixels: 0,
        totalPixels: 0,
        diffPercentage: 100,
        baselineImage: baselinePath,
        currentImage: currentPath,
      }
    }
  }

  private async loadImage(path: string): Promise<{
    data: ImageData
    width: number
    height: number
  }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("Failed to get canvas context"))
          return
        }

        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, img.width, img.height)

        resolve({
          data: imageData,
          width: img.width,
          height: img.height,
        })
      }

      img.onerror = () => reject(new Error(`Failed to load image: ${path}`))
      img.src = path
    })
  }

  private compareImageData(
    baseline: { data: ImageData; width: number; height: number },
    current: { data: ImageData; width: number; height: number },
    options: VisualRegressionOptions
  ): {
    diffPixels: number
    totalPixels: number
    diffPercentage: number
    diffImage?: string
  } {
    const baselineData = baseline.data.data
    const currentData = current.data.data
    const totalPixels = baseline.width * baseline.height
    let diffPixels = 0

    const diffCanvas = document.createElement("canvas")
    diffCanvas.width = baseline.width
    diffCanvas.height = baseline.height
    const diffCtx = diffCanvas.getContext("2d")

    if (!diffCtx) {
      return {
        diffPixels: 0,
        totalPixels,
        diffPercentage: 0,
      }
    }

    const diffImageData = diffCtx.createImageData(baseline.width, baseline.height)

    for (let i = 0; i < baselineData.length; i += 4) {
      const r1 = baselineData[i]
      const g1 = baselineData[i + 1]
      const b1 = baselineData[i + 2]
      const a1 = baselineData[i + 3]

      const r2 = currentData[i]
      const g2 = currentData[i + 1]
      const b2 = currentData[i + 2]
      const a2 = currentData[i + 3]

      const diff = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2)

      if (diff > 30) {
        diffPixels++

        diffImageData.data[i] = parseInt(options.diffColor!.slice(1, 3), 16)
        diffImageData.data[i + 1] = parseInt(options.diffColor!.slice(3, 5), 16)
        diffImageData.data[i + 2] = parseInt(options.diffColor!.slice(5, 7), 16)
        diffImageData.data[i + 3] = Math.round(255 * options.diffOpacity!)
      } else {
        diffImageData.data[i] = r1
        diffImageData.data[i + 1] = g1
        diffImageData.data[i + 2] = b1
        diffImageData.data[i + 3] = a1
      }
    }

    diffCtx.putImageData(diffImageData, 0, 0)

    const diffPercentage = (diffPixels / totalPixels) * 100

    return {
      diffPixels,
      totalPixels,
      diffPercentage,
      diffImage: diffCanvas.toDataURL("image/png"),
    }
  }

  private async saveImage(path: string, dataUrl: string): Promise<void> {
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    const arrayBuffer = await blob.arrayBuffer()

    return new Promise((resolve, reject) => {
      const fs = require("fs")
      fs.writeFile(path, Buffer.from(arrayBuffer), (err: Error | null) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  private async loadHtml2Canvas(): Promise<any> {
    return await import("html2canvas")
  }
}

export class VisualRegressionSuite {
  private tester: VisualRegressionTester
  private results: Map<string, VisualRegressionResult> = new Map()

  constructor(tester: VisualRegressionTester) {
    this.tester = tester
  }

  public async testComponent(
    testName: string,
    element: HTMLElement,
    options?: VisualRegressionOptions & ScreenshotOptions
  ): Promise<VisualRegressionResult> {
    const result = await this.tester.runVisualRegressionTest(testName, element, options)
    this.results.set(testName, result)
    return result
  }

  public async testMultipleComponents(
    tests: Array<{
      name: string
      element: HTMLElement
      options?: VisualRegressionOptions & ScreenshotOptions
    }>
  ): Promise<VisualRegressionResult[]> {
    const results: VisualRegressionResult[] = []

    for (const test of tests) {
      const result = await this.testComponent(test.name, test.element, test.options)
      results.push(result)
    }

    return results
  }

  public getResults(): VisualRegressionResult[] {
    return Array.from(this.results.values())
  }

  public getFailedResults(): VisualRegressionResult[] {
    return this.getResults().filter(result => !result.passed)
  }

  public getPassedResults(): VisualRegressionResult[] {
    return this.getResults().filter(result => result.passed)
  }

  public generateReport(): string {
    const passed = this.getPassedResults().length
    const failed = this.getFailedResults().length
    const total = this.results.size

    let report = `Visual Regression Test Report\n`
    report += `===============================\n\n`
    report += `Total Tests: ${total}\n`
    report += `Passed: ${passed}\n`
    report += `Failed: ${failed}\n`
    report += `Success Rate: ${((passed / total) * 100).toFixed(2)}%\n\n`

    if (failed > 0) {
      report += `Failed Tests:\n`
      report += `--------------\n`
      this.getFailedResults().forEach((result, testName) => {
        report += `\n${testName}:\n`
        report += `  Diff Percentage: ${result.diffPercentage.toFixed(2)}%\n`
        report += `  Diff Pixels: ${result.diffPixels} / ${result.totalPixels}\n`
        report += `  Baseline: ${result.baselineImage}\n`
        report += `  Current: ${result.currentImage}\n`
        if (result.diffImage) {
          report += `  Diff: ${result.diffImage}\n`
        }
      })
    }

    return report
  }

  public clearResults(): void {
    this.results.clear()
  }
}
