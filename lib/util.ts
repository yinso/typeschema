import * as Promise from 'bluebird';
import * as glob from 'glob';

export function globAsync(pattern : string) : Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    glob(pattern, (err, matches) => {
      if (err) {
        reject(err);
      } else {
        resolve(matches);
      }
    })
  })
}

export function extend(...items : {[key: string]: any}[]) : {[key: string]: any} {
  let result : {[key: string]: any} = {};
  for (var i = 0; i < items.length; ++i) {
    for (var key in items[i]) {
      if (items[i].hasOwnProperty(key)) {
        result[key] = items[i][key]
      }
    }
  }
  return result;
}
export function deepEqual(x : any, y : any) : boolean {
  if (x === undefined && y === undefined)
    return true;
  else if (x === null && y === null)
    return true;
  else if ((x instanceof Array) && (y instanceof Array))
    return deepEqualArray(<Array<any>>x, <Array<any>>y);
  else if ((x instanceof Date) && (y instanceof Date))
    return x.getTime() === y.getTime();
  else if ((x instanceof Object) && (y instanceof Object))
    return deepEqualObject(<Object>x, <Object>y);
  else if (typeof(x) === typeof(y))
    return x === y;
  else
    return false;
}

function deepEqualArray(x : Array<any>, y: Array<any>) : boolean {
  if (x.length !== y.length)
    return false;
  for (var i = 0; i < x.length; ++i) {
    if (!deepEqual(x[i], y[i]))
      return false
  }
  return true
}

function deepEqualObject(x : {[key : string]: any}, y: {[key: string]: any}) : boolean {
  if (Object.keys(x).length !== Object.keys(y).length)
    return false;
  for (var key in x) {
    if (x.hasOwnProperty(key)) {
      if (!y.hasOwnProperty(key))
        return false;
      if (!deepEqual(x[key], y[key]))
        return false;
    }
  }
  return true;
}
