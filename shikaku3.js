var hint = [];
var numberof = 0;
var problem = 1;
var answers = [];
var thepuzzle = [];
var url = "";

function Bob(){
	start_edit();
	clear_puzzle();
}

function disableSelection(target){
if (typeof target.onselectstart!="undefined") //IE route
	target.onselectstart=function(){return false}
else if (typeof target.style.MozUserSelect!="undefined") //Firefox route
	target.style.MozUserSelect="none"
else //All other route (ie: Opera)
	target.onmousedown=function(){return false}
target.style.cursor = "default"
}

var edit=0;
var x,y,v,w,a,b;
v=-1;
w=-1;
var inValid = new Array();//array of broken boxes to be removed i.e. boxes that are invalid
var Valid = new Array();//an array of valid boxes

if (!Array.prototype.indexIn)
{
  Array.prototype.indexIn = function(elt /*, from*/)
  {
    var len = this.length;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] == elt)
        return from;
    }
    return -1;
  };
}

Array.prototype.sortNum = function() {
   return this.sort( function (a,b) { return a-b; } );
}

var ObjectHandler = {
	getCloneOfObject: function(oldObject,level) {
		var tempClone;
		if ( level == undefined )
			level = 0;
		if ( oldObject == null )
			tempClone = null;
		else if ( typeof(oldObject) == "object" && oldObject.length != undefined ){
			tempClone = new Array;
			for ( var i = 0; i < oldObject.length; ++i ){
				tempClone[tempClone.length] = ObjectHandler.getCloneOfObject(oldObject[i],level + 1);
			}
		} else if ( typeof(oldObject) == "object" ){
			tempClone = new Object;
			for ( var i in oldObject ){
				tempClone[i] = ObjectHandler.getCloneOfObject(oldObject[i],level + 1);
			}
		} else {
			tempClone = oldObject;
		}
		return tempClone;
	}
};


var xmlHttp;


function check_answer2(){
	var t = height;
	var s = width;
	var check=[];
	var error=0;
	while(t>=0){
		while(s>=0){
			if(document.getElementById("cellw"+t+"h"+s).getAttribute("xml:lang")==""){
				error=1;
			} else {
				var wicks=1;
				for(var i=0; i<check.length; i++){
					if(check[i][0]==document.getElementById("cellw"+t+"h"+s).getAttribute("xml:lang")){
						check[i][1]=check[i][1]+1;
						if(document.getElementById("cellw"+t+"h"+s).innerHTML===0||document.getElementById("cellw"+t+"h"+s).innerHTML){
							if(check[i][2]){
								error=1;
							} else {
								check[i][2]=document.getElementById("cellw"+t+"h"+s).innerHTML;
							}
						}
						wicks=0;
					}
				}
				if(wicks){
					var light=0;
					if(document.getElementById("cellw"+t+"h"+s).innerHTML===0||document.getElementById("cellw"+t+"h"+s).innerHTML){
						light=document.getElementById("cellw"+t+"h"+s).innerHTML;
					}
					check.push([document.getElementById("cellw"+t+"h"+s).getAttribute("xml:lang"),1,light]);
				}
			}
			s--;
		}
		t--;
		s=width;
	}
	for(var i=0; i<check.length; i++){
		if(check[i][1]!=check[i][2]){
			error=1;
		}
	}
	if(error){
		return true;
	} else {
		return true;
	}
}

function check_answer(){
	var t = height;
	var s = width;
	var check=[];
	var error=0;
	while(t>=0){
		while(s>=0){
			if(document.getElementById("cellw"+t+"h"+s).getAttribute("xml:lang")==""){
				error=1;
			} else {
				var wicks=1;
				for(var i=0; i<check.length; i++){
					if(check[i][0]==document.getElementById("cellw"+t+"h"+s).getAttribute("xml:lang")){
						check[i][1]=check[i][1]+1;
						if(document.getElementById("cellw"+t+"h"+s).innerHTML===0||document.getElementById("cellw"+t+"h"+s).innerHTML){
							if(check[i][2]){
								error=1;
							} else {
								check[i][2]=document.getElementById("cellw"+t+"h"+s).innerHTML;
							}
						}
						wicks=0;
					}
				}
				if(wicks){
					var light=0;
					if(document.getElementById("cellw"+t+"h"+s).innerHTML===0||document.getElementById("cellw"+t+"h"+s).innerHTML){
						light=document.getElementById("cellw"+t+"h"+s).innerHTML;
					}
					check.push([document.getElementById("cellw"+t+"h"+s).getAttribute("xml:lang"),1,light]);
				}
			}
			s--;
		}
		t--;
		s=width;
	}
	for(var i=0; i<check.length; i++){
		if(check[i][1]!=check[i][2]){
			error=1;
		}
	}
	if(error){
		alert("Sorry, you made a mistake with the puzzle, try and fix your solution, or press \"hint\" for some help!");
	} else {
		alert("Good job! Now you should try a bigger puzzle");
	}
}

function hint_me(){
	if(thesolution.length!=0){
		if(hint.length==0){
			hint = ObjectHandler.getCloneOfObject(thesolution);
		}
		var shape = hint.shift();
		if(shape){
			var node = shape.pop();
			y=node[0];
			x=node[1];
			hitme();
			node = shape.pop();
			y=node[0];
			x=node[1];
			fixme();
		}
	} else {
		alert("Haven't got a soltion yet!\n(if it takes more than 30 seconds then the servers give up trying)");
	}
}

function solve_it(){
	if(thesolution.length!=0){
		var mysolution = ObjectHandler.getCloneOfObject(thesolution);
		for (i=0;i<=(thesolution.length-1);i++){
			var shape = mysolution.shift();
			if(shape){
				var node = shape.pop();
				y=node[0];
				x=node[1];
				hitme();
				node = shape.pop();
				y=node[0];
				x=node[1];
				fixme();
			} 
		}
		document.getElementById("errbox").className="edit";
	} else {
		alert("Haven't got a solution yet!\n(if it takes more than 30 seconds then the servers give up trying)");
	}
}

function solve(){
	thesolution=[];
	hint=[];
	numberof=0;
	xmlHttp=GetXmlHttpObject();
	if (xmlHttp==null){
		alert ("Browser does not support HTTP Request");
		return;
	} 
	var t = height;
	var s = width;
	var end = "";
	var total=0;
	var error=1;
	while(t>=0){
		while(s>=0){
			v=document.getElementById("inw"+t+"h"+s).value;
			v=v/1;
			end=end+"&cellw"+t+"h"+s+"="+v;
			if(v){
				if((v)/2&&v!=1){
					total=total+v;
				} else {
					error=0;
				}
			}
			s--;
		}
		t--;
		s=width;
	}
	if(total!=(width+1)*(height+1)){
		error=0;
	}
	if(error){
		url="width="+width+"&height="+height+end;
		var url2="einstein.php";
		//document.location=url2+"?"+url;
		xmlHttp.onreadystatechange=stateChanged;
		xmlHttp.open("POST",url2,true);
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlHttp.setRequestHeader("Content-length", url.length);
		xmlHttp.setRequestHeader("Connection", "close");
		xmlHttp.send(url);
		inValid=Valid;
		Valid=[];
		delInValid();
		end_edit();
	} else {
		alert("There is a problem with the puzzle, please correct it");
	}
}

function stateChanged(){ 
	if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete"){
		xmlDoc=xmlHttp.responseXML;
		if(xmlDoc.getElementsByTagName("status")[0]){
			var status=xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
			if(status=="Partial"){
				document.getElementById("time").innerHTML=xmlDoc.getElementsByTagName("time")[0].childNodes[0].nodeValue;
				document.getElementById("time2").innerHTML="";
				document.getElementById("nonedit").className="";
				document.getElementById("errbox").className="";
				document.getElementById("errbox").innerHTML="This has been partially solved using logic, meaning there may be more than one solution for this puzzle. I'm now using a brute force aproach to getting an a solution for you, hit \"Solve\" If you want to see what I've got so far";
				numberof=xmlDoc.getElementsByTagName("number")[0].childNodes[0].nodeValue;
				if(numberof>=0){
					var url2="";
					for (i=0;i<=numberof;i++){
						var p2=xmlDoc.getElementsByTagName("firstboxx"+i)[0].childNodes[0].nodeValue;
						var p=xmlDoc.getElementsByTagName("firstboxy"+i)[0].childNodes[0].nodeValue;
						var p4=xmlDoc.getElementsByTagName("lastboxx"+i)[0].childNodes[0].nodeValue;
						var p3=xmlDoc.getElementsByTagName("lastboxy"+i)[0].childNodes[0].nodeValue;
						thesolution.push([[p,p2],[p3,p4]]);
					}
					for(i=0;i<=width;i++){
						for(j=0;j<=height;j++){
							var p=xmlDoc.getElementsByTagName("cellw"+i+"h"+j)[0].childNodes[0].nodeValue;
							var quake=p.split(":");
							if(quake[0]!=""){
								url2=url2+"&cellaw"+i+"h"+j+"c0="+quake[0];
								url2=url2+"&cellaw"+i+"h"+j+"c1="+quake[1];
							}
						}
					}
					solve_more(1,url2);
				} else {
					document.getElementById("errbox").className="";
					document.getElementById("errbox").innerHTML="There may not be a unique solution for this puzzle, but there is a little logic that can be applied to it, currently I'm checking if this puzzle has a solution using a brute force aproach(can take a while)";
					for(i=0;i<=width;i++){
						for(j=0;j<=height;j++){
							var p=xmlDoc.getElementsByTagName("cellw"+j+"h"+i)[0].childNodes[0].nodeValue;
							var quake=p.split(":");
							if(quake[0]!=""){
								url2=url2+"&cellaw"+j+"h"+i+"c0="+quake[0];
								url2=url2+"&cellaw"+j+"h"+i+"c1="+quake[1];
							}
						}
					}
					solve_more(1,url2);
				}
			} else if(status=="SolvedL") {
				document.getElementById("time").innerHTML=xmlDoc.getElementsByTagName("time")[0].childNodes[0].nodeValue;
				document.getElementById("time2").innerHTML="";
				document.getElementById("nonedit").className="";
				document.getElementById("errbox").className="";
				document.getElementById("errbox").innerHTML="I managed to solve this using just logic, meaning this is a compleatly unique puzzle. To see it, press Solve";
				numberof=xmlDoc.getElementsByTagName("number")[0].childNodes[0].nodeValue;
				if(numberof>=0){
					for (i=0;i<=numberof;i++){
						var p2=xmlDoc.getElementsByTagName("firstboxx"+i)[0].childNodes[0].nodeValue;
						var p=xmlDoc.getElementsByTagName("firstboxy"+i)[0].childNodes[0].nodeValue;
						var p4=xmlDoc.getElementsByTagName("lastboxx"+i)[0].childNodes[0].nodeValue;
						var p3=xmlDoc.getElementsByTagName("lastboxy"+i)[0].childNodes[0].nodeValue;
						thesolution.push([[p,p2],[p3,p4]]);
					}
				} else {
					document.getElementById("errbox").className="";
					document.getElementById("errbox").innerHTML="There seems to be a problem with this puzzle, I can't provide you with a solution";
				}
			} else if(status=="Nada"){
				document.getElementById("errbox").className="";
				document.getElementById("errbox").innerHTML="This puzzle has no unique elements at all! So I'm checking that it has a valid solution using a brute force aproach(can take a while)";
				solve_more(0,"");
			} else if(status=="Solved"){
				document.getElementById("time2").innerHTML=xmlDoc.getElementsByTagName("time")[0].childNodes[0].nodeValue;
				document.getElementById("nonedit").className="";
				document.getElementById("errbox").className="";
				document.getElementById("errbox").innerHTML="I had to use a bit of brute force to solve this one, Hit \"Solve\" if you want to see the solution I got. (there is probably more than one that is valid)";
				numberof=xmlDoc.getElementsByTagName("number")[0].childNodes[0].nodeValue;
				if(numberof>=0){
					for (i=0;i<=numberof;i++){
						var p2=xmlDoc.getElementsByTagName("firstboxx"+i)[0].childNodes[0].nodeValue;
						var p=xmlDoc.getElementsByTagName("firstboxy"+i)[0].childNodes[0].nodeValue;
						var p4=xmlDoc.getElementsByTagName("lastboxx"+i)[0].childNodes[0].nodeValue;
						var p3=xmlDoc.getElementsByTagName("lastboxy"+i)[0].childNodes[0].nodeValue;
						thesolution.push([[p,p2],[p3,p4]]);
					}
				} else {
					document.getElementById("errbox").className="";
					document.getElementById("errbox").innerHTML="There seems to be a problem with this puzzle, I can't provide you with a solution";
				}
			} else if(status=="Not"){
				document.getElementById("errbox").className="";
				document.getElementById("errbox").innerHTML="I'm sorry I couldn't find a solution for this puzzle. I don't think it's a valid puzzle.";
			}
		} else  {
			document.getElementById("errbox").innerHTML="Sorry, can't give you any assistance with this puzzle.<br> It took too long to solve";
			document.getElementById("errbox").className="";
		}
	}
}
function solve_more(arg,url3){
	url=url+url3
	url2="newton.php";
	xmlHttp=GetXmlHttpObject();
	if (xmlHttp==null){
		alert ("Browser does not support HTTP Request");
		return;
	} 
	xmlHttp.onreadystatechange=stateChanged;
	xmlHttp.open("POST",url2,true);
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlHttp.setRequestHeader("Content-length", url.length);
	xmlHttp.setRequestHeader("Connection", "close");
	xmlHttp.send(url);
}

function GetXmlHttpObject(){
	var objXMLHttp=null;
	if (window.XMLHttpRequest){
		objXMLHttp=new XMLHttpRequest();
	} else if (window.ActiveXObject){
		objXMLHttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
	return objXMLHttp;
}

function value(){
	var q,r;
	Valid.sortNum();
	for(var i=0; i<Valid.length; i++){
		if(i!=Valid[i]){
			return i;
		}
	}
	return Valid.length;
}

function hitme(){ // when the mouse is pressed, 
	check_answer2();
	v=x;
	w=y;
}

function ff() {
	if (navigator.userAgent.toLowerCase().indexOf("firefox") != -1) return 1
	else return 0
}

function initialise(){ //fixes a problem ie8 has with highlighting cells. and a problem firefox has with borders.
	var t = height;
	var s = width;
	while(t>=0){
		while(s>=0){
			document.getElementById("cellw"+t+"h"+s).style.backgroundColor="white";
			s--;
		}
		t--;
		s=width;
	}
	if(ff()){
		document.getElementById("shikaku").className="table";
	}
}

function delInValid(){
	var t = height;
	var s = width;
	while(t>=0){
		while(s>=0){
			if((inValid.indexIn(document.getElementById("cellw"+t+"h"+s).getAttribute("xml:lang")))!=-1){
				document.getElementById("cellw"+t+"h"+s).className="";
				document.getElementById("cellw"+t+"h"+s).setAttribute("xml:lang","");
				document.getElementById("cellw"+t+"h"+s).title="";
			}
			s--;
		}
		t--;
		s=width;
	}
	for(var i=0; i<inValid.length; i++){
		for(var j=0; j<Valid.length; j++){
			if(inValid[i]==Valid[j]){
				Valid.splice(j,1);
			}
		}
	}
	inValid=[];
}

function dehighlight(){
	var t = height;
	var s = width;
	while(t>=0){
		while(s>=0){
			document.getElementById("cellw"+t+"h"+s).style.backgroundColor="white";
			s--;
		}
		t--;
		s=width;
	}
}

function pushunique(title){
	if((inValid.indexIn(title))==-1){
		inValid.push(title);
	}
}

function teh(){
	var asdf=v-x;
	var qwer=w-y;
	var poi,lkj,daddio,mummy;
	if(asdf<0){
		poi=-asdf;
		daddio=-asdf;
	} else {
		poi=asdf;
		daddio=asdf;
	}
	if(qwer<0){
		lkj=-qwer;
		mummy=-qwer;
	} else {
		lkj=qwer;
		mummy=qwer;
	}
	var zxcv=lkj;
	while(poi>=0){
		while(lkj>=0){
			document.getElementById("cellw"+(v-asdf)+"h"+(w-qwer)).title=(mummy+1)*(daddio+1);
			lkj--;
			if(qwer<0){
				qwer++;
			} else {
				qwer--;
			}
		}
		if(asdf<0){
			asdf++;
		} else {
			asdf--;
		}
		qwer=w-y;
		lkj=zxcv;
		poi--;
	}
}

function fixme(){
	dehighlight();
		if(v>-1&&w>-1&&x>-1&&y>-1&&!edit){
			a=v-x;
			b=w-y;
			r=b;
			if(a>-1){
				while(a>=0){
					if(b>-1){
						while(b>=0){
							if((document.getElementById("cellw"+(v-a)+"h"+(w-b)).getAttribute("xml:lang")===0)||(document.getElementById("cellw"+(v-a)+"h"+(w-b)).getAttribute("xml:lang"))){pushunique(document.getElementById("cellw"+(v-a)+"h"+(w-b)).getAttribute("xml:lang"))}
							document.getElementById("cellw"+(v-a)+"h"+(w-b)).setAttribute("xml:lang",value());
							teh();
							document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="solved";
							if(v-a!=x&&w-b!=y&&b==0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="bottomRight";
							}
							if(v-a!=x&&w-b!=y&&b!=0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="bottom";
							}
							if(v-a!=x&&w-b!=y&&b==0&&a!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="right";
							}
							if(v-a==x&&w-b==y&&a!=0&&b!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topLeft";
							}
							if(v-a==x&&w-b!=y&&a!=0&&b!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="top";
							}
							if(v-a!=x&&w-b==y&&a!=0&&b!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="left";
							}
							if(v-a==x&&w-b!=y&&b==0&&a!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topRight";
							}
							if(v-a!=x&&w-b==y&&b!=0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="bottomLeft";
							}
							if(v-a==x&&w-b!=y&&b!=0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topBottom";
							}
							if(v-a!=x&&w-b==y&&b==0&&a!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="rightLeft";
							}
							if(v-a==x&&w-b==y&&b!=0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topBottomLeft";
							}
							if(v-a==x&&w-b!=y&&b==0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topBottomRight";
							}
							if(v-a==x&&w-b==y&&b==0&&a!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topLeftRight";
							}
							if(v-a!=x&&w-b==y&&b==0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="bottomLeftRight";
							}
							if(v-a==x&&w-b==y&&b==0&&a==0){
								inValid.push(document.getElementById("cellw"+(v-a)+"h"+(w-b)).getAttribute("xml:lang"));
							}
							b--;
						}
						b=r;
						a--;
					} else {
						while(b<=0){
							if((document.getElementById("cellw"+(v-a)+"h"+(w-b)).getAttribute("xml:lang")===0)||(document.getElementById("cellw"+(v-a)+"h"+(w-b)).getAttribute("xml:lang"))){pushunique(document.getElementById("cellw"+(v-a)+"h"+(w-b)).getAttribute("xml:lang"))}
							document.getElementById("cellw"+(v-a)+"h"+(w-b)).setAttribute("xml:lang",value());
							teh();
							document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="solved";
							if(v-a!=x&&w-b!=y&&b==0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="bottomLeft";
							}
							if(v-a!=x&&w-b!=y&&b!=0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="bottom";
							}
							if(v-a!=x&&w-b!=y&&b==0&&a!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="left";
							}
							if(v-a==x&&w-b==y&&a!=0&&b!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topRight";
							}
							if(v-a==x&&w-b!=y&&a!=0&&b!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="top";
							}
							if(v-a!=x&&w-b==y&&a!=0&&b!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="right";
							}
							if(v-a==x&&w-b!=y&&b==0&&a!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topLeft";
							}
							if(v-a!=x&&w-b==y&&b!=0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="bottomRight";
							}
							if(v-a==x&&w-b!=y&&b!=0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topBottom";
							}
							if(v-a!=x&&w-b==y&&b==0&&a!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="rightLeft";
							}
							if(v-a==x&&w-b==y&&b!=0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topBottomRight";
							}
							if(v-a==x&&w-b!=y&&b==0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topBottomLeft";
							}
							if(v-a==x&&w-b==y&&b==0&&a!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topLeftRight";
							}
							if(v-a!=x&&w-b==y&&b==0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="bottomLeftRight";
							}
							if(v-a==x&&w-b==y&&b==0&&a==0){
								inValid.push(document.getElementById("cellw"+(v-a)+"h"+(w-b)).getAttribute("xml:lang"));
							}
							b++;
						}
						b=r
						a--;
					}
				}
			} else {
				while(a<=0){
					if(b>-1){
						while(b>=0){
							if((document.getElementById("cellw"+(v-a)+"h"+(w-b)).getAttribute("xml:lang")===0)||(document.getElementById("cellw"+(v-a)+"h"+(w-b)).getAttribute("xml:lang"))){pushunique(document.getElementById("cellw"+(v-a)+"h"+(w-b)).getAttribute("xml:lang"))}
							document.getElementById("cellw"+(v-a)+"h"+(w-b)).setAttribute("xml:lang",value());
							teh();
							document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="solved";
							if(v-a!=x&&w-b!=y&&b==0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topRight";
							}
							if(v-a!=x&&w-b!=y&&b!=0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="top";
							}
							if(v-a!=x&&w-b!=y&&b==0&&a!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="right";
							}
							if(v-a==x&&w-b==y&&a!=0&&b!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="bottomLeft";
							}
							if(v-a==x&&w-b!=y&&a!=0&&b!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="bottom";
							}
							if(v-a!=x&&w-b==y&&a!=0&&b!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="left";
							}
							if(v-a==x&&w-b!=y&&b==0&&a!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="bottomRight";
							}
							if(v-a!=x&&w-b==y&&b!=0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topLeft";
							}
							if(v-a==x&&w-b!=y&&b!=0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topBottom";
							}
							if(v-a!=x&&w-b==y&&b==0&&a!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="rightLeft";
							}
							if(v-a==x&&w-b==y&&b!=0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topBottomLeft";
							}
							if(v-a==x&&w-b!=y&&b==0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topBottomRight";
							}
							if(v-a==x&&w-b==y&&b==0&&a!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="bottomLeftRight";
							}
							if(v-a!=x&&w-b==y&&b==0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topLeftRight";
							}
							if(v-a==x&&w-b==y&&b==0&&a==0){
								inValid.push(document.getElementById("cellw"+(v-a)+"h"+(w-b)).getAttribute("xml:lang"));
							}
							b--;
						}
						b=r;
						a++;
					} else {
						while(b<=0){
							if((document.getElementById("cellw"+(v-a)+"h"+(w-b)).getAttribute("xml:lang")===0)||(document.getElementById("cellw"+(v-a)+"h"+(w-b)).getAttribute("xml:lang"))){pushunique(document.getElementById("cellw"+(v-a)+"h"+(w-b)).getAttribute("xml:lang"))}
							document.getElementById("cellw"+(v-a)+"h"+(w-b)).setAttribute("xml:lang",value());
							teh();
							document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="solved";
							if(v-a!=x&&w-b!=y&&b==0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topLeft";
							}
							if(v-a!=x&&w-b!=y&&b!=0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="top";
							}
							if(v-a!=x&&w-b!=y&&b==0&&a!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="left";
							}
							if(v-a==x&&w-b==y&&a!=0&&b!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="bottomRight";
							}
							if(v-a==x&&w-b!=y&&a!=0&&b!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="bottom";
							}
							if(v-a!=x&&w-b==y&&a!=0&&b!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="right";
							}
							if(v-a==x&&w-b!=y&&b==0&&a!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="bottomLeft";
							}
							if(v-a!=x&&w-b==y&&b!=0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topRight";
							}
							if(v-a==x&&w-b!=y&&b!=0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topBottom";
							}
							if(v-a!=x&&w-b==y&&b==0&&a!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="rightLeft";
							}
							if(v-a==x&&w-b==y&&b!=0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topBottomRight";
							}
							if(v-a==x&&w-b!=y&&b==0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topBottomLeft";
							}
							if(v-a==x&&w-b==y&&b==0&&a!=0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="bottomLeftRight";
							}
							if(v-a!=x&&w-b==y&&b==0&&a==0){
								document.getElementById("cellw"+(v-a)+"h"+(w-b)).className="topLeftRight";
							}
							if(v-a==x&&w-b==y&&b==0&&a==0){
								inValid.push(document.getElementById("cellw"+(v-a)+"h"+(w-b)).getAttribute("xml:lang"));
							}
							b++;
						}
						b=r;
						a++;
					}
				}
			}
			Valid.push(value());
			delInValid();
		}
	v=-1;
	w=-1;
}

function lightme(){
	dehighlight();
	// need to check array of valid cells and find a number that is unused.
		if(v>-1&&w>-1&&x>-1&&y>-1&&!edit){
			a=v-x;

			b=w-y;
			r=b;
			if(a>=0){
				while(a>=0){
					if(b>=0){
						while(b>=0){
							document.getElementById("cellw"+(v-a)+"h"+(w-b)).style.backgroundColor="yellow";
							b--;
						}
						b=r;
						a--;
					} else {
						while(b<=0){
							document.getElementById("cellw"+(v-a)+"h"+(w-b)).style.backgroundColor="yellow";
							b++;
						}
						b=r
						a--;
					}
				}
			} else {
				while(a<=0){
					if(b>-1){
						while(b>=0){
							document.getElementById("cellw"+(v-a)+"h"+(w-b)).style.backgroundColor="yellow";
							b--;
						}
						b=r;
						a++;
					} else {
						while(b<=0){
							document.getElementById("cellw"+(v-a)+"h"+(w-b)).style.backgroundColor="yellow";
							b++;
						}
						b=r
						a++;
					}
				}
			}
		}
}
function start_edit(){
	if(!edit){
		document.getElementById("editbtn").innerHTML="Save";
		document.getElementById("edit").className="";
		document.getElementById("nonedit").className="edit";
		document.getElementById("errbox").className="edit";
		edit=1;
		var width1=width;
		var height1=height;
		while(width1>-1){
			while(height1>-1){
				document.getElementById("cellw"+height1+"h"+width1).innerHTML="<input size=\"1\" type=\"text\" id=\"inw"+height1+"h"+width1+"\" value="+document.getElementById("cellw"+height1+"h"+width1).innerHTML+">";
				height1--;
			}
			width1--;
			height1=height;
		}
	} else{
		solve();
	}
}

function end_edit(){
		document.getElementById("editbtn").innerHTML="Edit";
		document.getElementById("edit").className="edit";
		document.getElementById("errbox").className="";
		document.getElementById("errbox").innerHTML="I'm busy solving this puzzle - it can take a while for larger puzzles!";
		edit=0;
		var width1=width;
		var height1=height;
		while(width1>-1){
			while(height1>-1){
				document.getElementById("cellw"+height1+"h"+width1).innerHTML=document.getElementById("inw"+height1+"h"+width1).value;
				height1--;
			}
			width1--;
			height1=height;
		}
}

function clear_puzzle(){
	if(edit){
		var width1=width;
		var height1=height;
		while(width1>-1){
			while(height1>-1){
				document.getElementById("cellw"+height1+"h"+width1).innerHTML="<input size=\"1\" type=\"text\" id=\"inw"+height1+"h"+width1+"\" >";
				height1--;
			}
			width1--;
			height1=height;
		}
	}
}
