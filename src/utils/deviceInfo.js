export const LAYOUT = {
  rows: 9,
  columns: 15,
  tilesPerUnit: 1,
};

export const generateDeviceFromRemoteModels = (devices) => {
  const converter = (device) => {
    const { attributes: { key, name, shape, label, url } } = device;
    return {
      name: key,
      label: name,
      shape: shape === 'two' ? 2 : 1,
      url,
    }
  }
  return devices.map(converter);
}

export const name2label = {
  aizai1: '矮仔炉',
  aizai2: '双头矮仔炉',
  chao1: '炒炉',
  chao2: '双头炒炉',
  chao3: '大炒炉',
  zhenggui: '蒸柜',
  // zhenglu: '蒸炉',
  pintai: '拼台',
  other: '其他',
};

// TODO: change to remote info
export const getDeviceInfo = (name, vertical) => {
  const tilesPerUnit = LAYOUT.tilesPerUnit;
  const oneTileDevices = ['aizai1', 'chao1', 'chao3', 'zhenggui', 'pintai', 'other'];
  const twoTileDevices = ['aizai2', 'chao2'];
  const label = name2label[name];
  if (name === 'other') {
    return { name, wf: tilesPerUnit, hf: tilesPerUnit, label, shape: 'custom' };
  } else if (oneTileDevices.includes(name)) {
    return { name, wf: tilesPerUnit, hf: tilesPerUnit, label, shape: 'one' };
  } else if (twoTileDevices.includes(name)) {
    const wf = (vertical ? 1 : 2) * tilesPerUnit;
    const hf = (vertical ? 2 : 1) * tilesPerUnit;
    return { name, vertical, wf, hf, label, shape: 'two' };
  } else {
    console.error(`[deviceinfo]unknown device name: ${name}`);
    // return { name: ''}
    return {name: 'other', wf: tilesPerUnit, hf: tilesPerUnit, label};
  }
};

const sumMatrix = (matrixList) => {
  const { rows, columns, tilesPerUnit } = LAYOUT;
  if (!Array.isArray(matrixList)) {
    throw new Error('is not an array');
  }
  const matrix = [...Array(rows)].map(elem => [...Array(columns)].map(e => 0));
  matrixList.forEach((m, index) => {
    if (m.length !== rows) {
      throw new Error(`index: ${index} need ${rows} rows`);
    }
    for (let i = 0; i < rows; i ++) {
      for (let j = 0; j < columns; j ++) {
        matrix[i][j] = parseInt(matrix[i][j]) + parseInt(m[i][j]);
      }
    }
  });
  return matrix;
};

const generateDeviceMatrix = (xPosition, yPosition, xLength, yLength) => {
  const { rows, columns, tilesPerUnit } = LAYOUT;
  const matrix = [...Array(rows)].map(elem => [...Array(columns)].map(e => 0));
  for(let i = 0; i < yLength; i ++) {
    for(let j = 0; j < xLength; j ++) {
      matrix[yPosition + i][xPosition + j] += 1;
    }
  }

  for(let i = 0; i < rows; i ++) {
  }
  return matrix;
};

const getXTiles = (direction, shape, length) => {
  const { tilesPerUnit } = LAYOUT;
  if (shape === 'custom' && length) {
    return length ? Math.ceil(length / 300) : tilesPerUnit;
  }
  return (shape === 'two' && direction !== 'vertical' ? 2 : 1) * tilesPerUnit;
};

const getYTiles = (direction, shape, width) => {
  const { tilesPerUnit } = LAYOUT;
  if (shape === 'custom' && width) {
    return width ? Math.ceil(width / 300) : tilesPerUnit;
  }
  return (shape === 'two' && direction === 'vertical' ? 2 : 1) * tilesPerUnit;
};

export const hasConflict = devices => {
  const { rows, columns, tilesPerUnit } = LAYOUT;
  const deviceMatrixList = devices.map(i => {
    const x = i.xPosition;
    const y = i.yPosition;
    const xLength = getXTiles(i.direction, i.shape, i.length);
    const yLength = getYTiles(i.direction, i.shape, i.width);
    return generateDeviceMatrix(x, y, xLength, yLength);
  });
  const matrix = sumMatrix(deviceMatrixList);
  return matrix.filter(row => row.filter(i => i > 1).length > 0).length > 0;
};

export const isInLayout = (device, xPosition, yPosition) => {
  const xMax = LAYOUT.columns - device.wf;
  const yMax = LAYOUT.rows - device.hf;
  if (
    xPosition >= 0 &&
    yPosition >= 0 &&
    xPosition <= xMax &&
    yPosition <= yMax
  ) {
    return true;
  } else {
    return false;
  }
}
