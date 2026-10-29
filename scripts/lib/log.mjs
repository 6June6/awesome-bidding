/**
 * 终端输出小工具。CI 里没有 TTY 时自动退化，避免日志里出现转义码。
 */
const codes = { red: 31, green: 32, yellow: 33, blue: 34, dim: 2, bold: 1 };

function wrap(code) {
  return (s) => (process.stdout.isTTY ? `\u001b[${code}m${s}\u001b[0m` : String(s));
}

export const red = wrap(codes.red);
export const green = wrap(codes.green);
export const yellow = wrap(codes.yellow);
export const blue = wrap(codes.blue);
export const dim = wrap(codes.dim);
export const bold = wrap(codes.bold);

export const ok = (msg) => console.log(`${green('✓')} ${msg}`);
export const warn = (msg) => console.log(`${yellow('!')} ${msg}`);
export const bad = (msg) => console.log(`${red('✗')} ${msg}`);
export const info = (msg) => console.log(`${blue('·')} ${msg}`);

/**
 * 统一的「有问题就失败」出口：错误非空则打印并退出 1。
 * @param {string[]} errors
 * @param {string[]} warnings
 */
export function finish(errors, warnings = []) {
  for (const w of warnings) warn(w);
  if (errors.length > 0) {
    console.log('');
    for (const e of errors) bad(e);
    console.log('');
    console.log(red(`共 ${errors.length} 个问题，未通过。`));
    process.exit(1);
  }
  ok('全部检查通过。');
}
