// This loader is a fork of https://github.com/NoamELB/react-hot-loader-loader
//
// I changed it so I could be lazier and now it only runs on anything that returns a react element
//

function transformSourceForClass(source, className) {
  source = source.replace(/^\s*export\s+default\s+/m, '');
  source += `\nexport default hot(${className});`;
  return source;
}

function transformSourceForNamedFunction(source, functionName) {
  source = source.replace(/^\s*export\s+default\s+/m, '');
  source += `\nexport default hot(${functionName});`;
  return source;
}

function transformSourceDefault(source) {
  source = source.replace(/^\s*export\s+default/m, 'const ___HMRComponent =');
  source += '\nexport default hot(___HMRComponent);';
  return source;
}

function getImportLine() {
  return 'import { hot } from \'react-hot-loader/root\';\n';
}

function getExportDefaultClassName(source) {
  let className = '';
  const matches = source.match(/^\s*export\s+default\s+class\s+(.*?)\s+extends\s+(?:(?:React\.|react\.)?Component)\s/m);
  if (matches && matches[1]) {
    className = matches[1];
  }
  return className;
}

function getExportDefaultFunctionName(source) {
  let functionName = '';
  const matches = source.match(/^\s*export\s+default\s+function\s+([^(\s]*)\s?\(/m);
  if (matches && matches[1]) {
    functionName = matches[1];
  }
  return functionName;
}
function getShouldTransformDefault(source) {
  return !!source.match(/\s*export\s*default\s*(?:[a-zA-Z].*\()?[A-Z]+(?:[a-z0-9]+[A-Z])?[a-z].*/m);
}

function AddReactHotLoader(source) {
  // if production, or cannot find a default export, do nothing
  if (true || process.env.NODE_ENV === 'production' || !source || !(/^\s*export\s+default/m).exec(source) || (/$ *\/\/ *AUTO-RHL *OFF/).exec(source)) {
    return source;
  }

  // replace the default export
  let newSource = getImportLine() + source;
  const className = getExportDefaultClassName(source);
  const functionName = getExportDefaultFunctionName(source);
  const shouldTransformDefault = getShouldTransformDefault(source);
  if (className) {
    newSource = transformSourceForClass(newSource, className);
  } else if (functionName) {
    newSource = transformSourceForNamedFunction(newSource, functionName);
  } else if (shouldTransformDefault) {
    newSource = transformSourceDefault(newSource);
  } else {
    return source;
  }
  return newSource;
}

module.exports = AddReactHotLoader;
