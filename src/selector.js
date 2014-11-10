var traverseDomAndCollectElements = function(matchFunc, startEl) 
{
  var resultSet = [];
  var childCollection=[];

  if (typeof startEl === "undefined") 
  {
    startEl = document.body;
  }

  if(matchFunc(startEl))
  { 
    //push to results if match
    resultSet.push(startEl);
  }

  if(startEl.children)
  {
    var children = startEl.children;

    Object.keys(children).forEach(function(el)
    {
      if(!isNaN(parseInt(el)))
      {
        //We only care about the numbered children keys, there were extra matches that weren't children
        childCollection.push(children[el]);
      } 
    });
  }

  if(childCollection.length > 0)
  {
    childCollection.forEach(function(el)
    {   
      //Traversing for all children recursively
      resultSet = resultSet.concat(traverseDomAndCollectElements(matchFunc,el));
    });
  }

  return resultSet;
};


// detect and return the type of selector
// return one of these types: id, class, tag.class, tag
//
var selectorTypeMatcher = function(selector) {
  if(selector[0]==='#'){
    return 'id';
  } else if (selector[0]==='.'){
    return 'class';
  } else if (selector.indexOf('.')>-1){
    return 'tag.class';
  } else {
    return 'tag';
  }
};


var matchFunctionMaker = function(selector) 
{
  var selectorType = selectorTypeMatcher(selector);
  var matchFunction;
  
  if (selectorType === "id") 
  {
    // define matchFunction for id
    return function(DomElement)
    {
      var selectorName = selector.slice(1);
      return DomElement.id === selectorName ? true:false;
    }
  } 
  
  else if (selectorType === "class") 
  {
    // define matchFunction for class
    return function(DomElement)
    {
      var selectorName = selector.slice(1);
      var classNames = DomElement.className.split(' ');
      var trueOrFalse =false;

      classNames.forEach(function(ele)
      {
        if(selectorName === ele)
          {
            trueOrFalse = true;
          }
      });

      return trueOrFalse;
    }
  }

  else if (selectorType === "tag.class") 
  {
    // define matchFunction for tag.class
    return function(DomElement)
    {
      var selectorName = selector.split('.');
      if(DomElement.tagName.toLowerCase() === selectorName[0])
      {
        var classNames = DomElement.className.split(' ');
        var trueOrFalse = false;
        classNames.forEach(function(ele)
        {
          if(selectorName[1].indexOf(ele) > -1)
            {
              trueOrFalse = true;
            }
        });

        return trueOrFalse;
      }
    }
  }

  else if (selectorType === "tag") 
  {
    // define matchFunction for tag
    return function(DomElement)
    {
      var selectorName = selector;
      return DomElement.tagName.toLowerCase() === selectorName ? true:false;
    }
  }

  return matchFunction;
};

var $ = function(selector) 
{
  debugger;
  var elements;
  var selectorMatchFunc = matchFunctionMaker(selector);
  elements=traverseDomAndCollectElements(selectorMatchFunc);
  console.log(elements);

  return elements;
};