// var groupNumberInput = document.getElementById('group-number-input');
var groupSizeInput = document.getElementById('group-size-input');
var fileInput = document.getElementById('file-input');
var randomButton = document.getElementById('random-button');
var inputList = document.getElementById('input-list');
var outputList = document.getElementById('output-list');
var placeholder = document.getElementById('placeholder');
var input = [];
var output = [];

randomButton.addEventListener('click', RNGesus, false);

function render() {
  if (input.length > 0 || output.length > 0) {
    placeholder.className = 'row hidden';
  } else {
    placeholder.className = 'row';
  }
  inputList.innerHTML = '';
  input.forEach(function (element) {
    let li = document.createElement('li');
    li.textContent = element.value;
    inputList.appendChild(li);
  });
  outputList.innerHTML = '';
  output.forEach(function (list) {
    let oli = document.createElement('li');
    let ul = document.createElement('ul');
    oli.appendChild(ul);
    list.forEach(function (element) {
      let li = document.createElement('li');
      li.textContent = element.value;
      ul.appendChild(li);
    });
    outputList.appendChild(oli);
  });
}

function loadInput (file) {
  let fileReader = new FileReader();
  fileReader.onload = (function (fileReader) {
    return function (e) {
      try {
        input = JSON.parse(fileReader.result);
        if (input instanceof Array) {
          render();
        } else {
          throw 'expected an array';
        }
      } catch (e) {
        console.log(e);
        alert('unable to parse input');
      }
    }
  })(fileReader);
  fileReader.readAsText(file);
}

function RNGesus () {
  // const groupNumber = groupNumberInput.valueAsNumber || 1;
  const groupNumber = 100;
  let groupSize = groupSizeInput.valueAsNumber || 1;
  const uniques = input.filter(function (element) {
    return element.unique;
  });
  const nonUniques = input.filter(function (element) {
    return !element.unique;
  });
  if (uniques.length > 0) {
    groupSize--;
  }
  if (groupNumber === 1) {
    output = [chance.pickset(nonUniques, groupSize)];
  } else {
    output = chance.shuffle(nonUniques).reduce(function (acc, val, idx) {
      if (acc.length < groupNumber) {
        if (acc[acc.length - 1].length < groupSize) {
          return [...acc.slice(0, acc.length - 1), acc[acc.length - 1].concat(val)];
        } else {
          return [...acc, [val]];
        }
      } else {
        return acc;
      }
    }, [[]]);
  }
  if (uniques.length > 0) {
    chance.shuffle(uniques).forEach(function (element, idx) {
      if(idx < output.length) {
        output[idx].splice(chance.integer({min: 0, max: output[idx].length}), 0, element);
      }
    });
  }
  render();
}
