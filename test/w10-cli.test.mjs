// W10 验收：drpy3 test CLI（§14.3）——百忙无果1-4 与 央视频-1/2 全部 test 全绿（fixtures 录制 + 离线回放）。
// 同时验证：结构化 JSON 输出 + 退出码。
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const CLI = path.join(ROOT, 'cli', 'drpy3-test.mjs');
const exec = promisify(execFile);

const BENCHMARKS = [
    {file: 'docs/百忙无果1.js', extra: []},
    {file: 'docs/百忙无果2.js', extra: []},
    {file: 'docs/百忙无果3.js', extra: ['--lib', 'docs/百忙无果3.lib.js=lib/mgtv.js', '--asset', 'test/fixtures/sign.wasm=lib/sign.wasm']},
    {file: 'docs/百忙无果4.js', extra: []},
    {file: 'docs/央视频-1.js', extra: ['--asset', 'test/fixtures/cntv-wasm-stub.cjs=cntv-wasm.cjs']},
    {file: 'docs/央视频-2.js', extra: ['--asset', 'test/fixtures/cntv-wasm-stub.cjs=cntv-wasm.cjs']},
];

async function runCli(mode, bench) {
    const args = [CLI, bench.file, mode, ...bench.extra];
    const {stdout} = await exec('node', args, {cwd: ROOT, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024});
    const marker = stdout.indexOf('===DRPY3_RESULT===');
    assert.ok(marker >= 0, 'CLI 输出含结果标记');
    return JSON.parse(stdout.slice(marker + '===DRPY3_RESULT==='.length));
}

test('W10 CLI：六标杆源 --record 录制 fixtures 并六环节全绿', {timeout: 300000}, async () => {
    for (const bench of BENCHMARKS) {
        const out = await runCli('--record', bench);
        assert.equal(out.ok, true, `${bench.file} record 全绿（失败: ${JSON.stringify(out.stages.filter((s) => !s.ok))}）`);
        assert.equal(out.stages.length, 6, `${bench.file} 六环节`);
    }
});

test('W10 CLI：六标杆源 --replay 离线回放全绿（零网络）', {timeout: 300000}, async () => {
    for (const bench of BENCHMARKS) {
        const out = await runCli('--replay', bench);
        assert.equal(out.ok, true, `${bench.file} replay 全绿（失败: ${JSON.stringify(out.stages.filter((s) => !s.ok))}）`);
        assert.equal(out.mode, 'replay');
    }
});

test('W10 CLI：结构化输出含 stage/ok 与退出码约定', {timeout: 120000}, async () => {
    const out = await runCli('--replay', BENCHMARKS[0]);
    for (const stage of ['init', 'home', 'category', 'search', 'detail', 'play']) {
        const r = out.stages.find((s) => s.stage === stage);
        assert.ok(r && r.ok === true, `stage ${stage} 存在且 ok`);
    }
});
