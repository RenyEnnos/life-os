#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { mkdirSync, existsSync } from 'node:fs'

const url = process.env.LH_URL || 'http://localhost:5175/'

if (!existsSync('reports')) mkdirSync('reports')
const ts = new Date().toISOString().replace(/[:.]/g, '-').replace('T','-').slice(0,19)

function runLighthouse(mode) {
  const base = `npx lighthouse ${url} --quiet --output html --output json --only-categories=performance,accessibility,best-practices,seo`
  const flags = mode === 'desktop' ? `--preset=desktop` : ``
  const outHtml = `--output-path=reports/lh_${mode}_${ts}.html`
  const outJson = `--output-path=reports/lh_${mode}_${ts}.json`
  const cmd = `${base} ${flags} ${outHtml}`
  const cmd2 = `${base} ${flags} ${outJson}`
  console.log(`Running Lighthouse (${mode}) on ${url}...`)
  execSync(cmd, { stdio: 'inherit' })
  execSync(cmd2, { stdio: 'inherit' })
}

runLighthouse('mobile')
runLighthouse('desktop')
console.log('Reports generated in ./reports')
