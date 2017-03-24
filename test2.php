<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Shikaku</title>
<script language="javascript" type="text/javascript">
function printme(){
parent.window.frames["iframe"].focus();
parent.window.frames["iframe"].print();
}
</script>
<script language="javascript" type="text/javascript">
<?php
    	$width = $_REQUEST["width"];
		$height = $_REQUEST["height"];
        if ($width == ""){
        	$width = $_REQUEST["up_width"];
    		$height = $_REQUEST["up_height"];
            }
        if ($width == ""){
            $width = 10;
            $height = 10;
            }
		$width--;
		$height--;
		gentime();
		$val=boxit($width+1,$height+1,0,0);
		echo "var width=$width;\n";
		echo "var height=$height;\n";
		echo "var thesolution =[";
		foreach ($val as $v){
			echo "[[[$v[4]],[$v[3]]],[[$v[6]],[$v[5]]]],";
		}
		echo "]\n";
?>
</script>
<script src="shikaku3.js" language="javascript" type="text/javascript">
</script>
<link rel="stylesheet" type="text/css" href="shikaku2.css">
</head>
<!--
<?php
		foreach ($val as $v){
			echo "[[[$v[1]], [$v[2]]],[[$v[4]],[$v[3]]],[[$v[6]],[$v[5]]]],";
		}
?>
!-->

<body onload="initialise();disableSelection(document.body);<? if ($_REQUEST["Create"]){?>Bob();<?php } ?>">
<table border="2" cellspacing="0" cellpadding="0" id="shikaku" onmouseup="fixme();" onmousedown="hitme();" class="shikaku">
  <caption>
    Shikaku Puzzle
  </caption>
  	<?php
		for ($i = 0; $i <= $height; $i++) {
			echo "<tr>";
			for ($j = 0; $j <= $width; $j++) {
				echo "<td id=\"cellw$i";
				echo "h$j\" onmouseover=\"x=$i;y=$j;lightme()\">";
				foreach($val as $v){
					if($v[0]==$j&&$v[1]==$i){
						echo "$v[2]";
					}
				}
				echo "</td>\n";
			}
			echo "</tr>\n";
		}
		function gentime(){
			static $a;
			if($a == 0) $a = microtime(true);
			else return (string)(microtime(true)-$a);
		}
		function boxit($width,$height,$offsetx,$offsety){
			$bigbox=$width*$height;
			if($bigbox>0&&($width!=1||$height!=1)){
				if($bigbox!=2&&$bigbox!=3){
					if($width==1||$height==1){
						$rand=1;
					}	else {
						$rand=rand(0,1);
					}
					if($rand){
						if($bigbox==5){
							$rand=rand(0,1);
							if($rand){
								$rand=rand(0,1);
								if($rand){
									$bigbox=3;
								} else {
									$bigbox=2;
								}
							}
						} else {
							if($bigbox==4){
								$rand=rand(0,4);
								if($rand=0){
									$bigbox=2;
								} else {
									$bigbox=4;
								}
							} else {
								if($bigbox!=6||$bigbox!=9){
									$ww=$width/2.4;
									$hh=$height/2.4;
									$www=preg_split("/\./", "$ww", 2);
									$hhh=preg_split("/\./", "$hh", 2);
									$ww=$www[0];
									$hh=$hhh[0];
									$rand=rand(0,1);
									$ww=$ww+$rand;
									$rand=rand(0,1);
									$hh=$hh+$rand;
									$bigbox=$ww*$hh;
									if($bigbox<4){
										$bigbox=2;
									}
								} else{
									$rand=rand(0,4);
									if($rand==4){
										$bigbox=3;
									}
									
								}
							}
						}
					} else {
						//do a width shaped area
						if($width>=$height){
							$r=$height;
						} else {
							$r=$width;
						}
						if($height>1&&$width>1){
							if($r&1){
								$r--;
							}
							$rand=rand(1,0);
							if($rand){
								$r=$r*2;
							}
							if ($r>20){
								if($width<5||$height<5){
									$r=10;
								} else {
									$r1=rand(3,5);
									$r2=rand(2,4);
									$r=$r1*$r2;
								}
							}
						}
						$bigbox=$r;
					}
				}
				if(($bigbox>3*$height||$bigbox>3*$width)&&$width>3&&$height>3){
					$rand1=rand(0,3);
					$rand2=rand(0,3);
					if($height>$width){
						$bigbox=($width-$rand1)*2;
					} else {
						$bigbox=($height-$rand2)*1*2;
					}
				}
				if(($bigbox==$height*$width-1)||$bigbox==1){
					$bigbox=$height*$width;
				}
				if($bigbox>81){
					if($width>9&&$height>9){
						$bigbox=rand(6,9)*rand(6,9);
					}
				}
				if($bigbox==2){
					if(($width*$height)>3&&($width*$height)!=5){
						if(rand(0,4)){
							$bigbox=4;
							if($width*$height>7){
								if(rand(0,2)){
									$bigbox=8;
									if(rand(0,1)){
										$bigbox=6;
									}
								}
							}
						}
					}
				}
				if(($bigbox==$height*$width-1)||$bigbox==1){
					$bigbox=$height*$width;
				}
				$ppw=array();
				$pph=array();
				if($width==1||$height==1){
					$pheight=1;
					$pwidth=1;
				} else{
					$pwidth=($width+1)/2;
					$pheight=($height+1)/2;
					$ppw=preg_split("/\./", "$pwidth", 2);
					$pph=preg_split("/\./", "$pheight", 2);
				}
				if($ppw[1]){
					$rand=rand(0,1);
					$pwidth=$ppw[0]+$rand;
				}
				if($pph[1]){
					$rand=rand(0,1);
					$pheight=$pph[0]+$rand;
				}
				$shapes=getshapes($bigbox,$width,$height);
				$shape=shape($shapes,$bigbox,$pwidth-1,$pheight-1,$width,$height,$offsetx,$offsety);
				if($shape==0){
					$shapes=getshapes(($width*$height),$width,$height);
					$shape=shape($shapes,$bigbox,$pwidth-1,$pheight-1,$width,$height,$offsetx,$offsety);
				}
				if($shape!=0){
					$rand=rand(1,3);
					if($shape[0][2]-$shape[1][2]==0){
						$rand=1;
					} elseif($shape[0][3]-$shape[1][3]==0){
						$rand=2;
					}
					if($rand==1){
						$area1=boxit($shape[1][2],($shape[0][3]+1)-$shape[1][3],$offsetx,$offsety+$shape[1][3]);
						$area2=boxit($width,$height-$shape[0][3]-1,$offsetx,$offsety+$shape[0][3]+1);
						$area3=boxit($width-$shape[0][2]-1,($shape[0][3]+1)-$shape[1][3],$offsetx+$shape[0][2]+1,$offsety+$shape[1][3]);
						$area4=boxit($width,$shape[1][3],$offsetx,$offsety);
					} elseif($rand=2){
						$area1=boxit($shape[1][2],$height,$offsetx,$offsety);
						$area2=boxit(($shape[0][2]+1)-$shape[1][2],$height-$shape[0][3]-1,$offsetx+$shape[1][2],$offsety+$shape[0][3]+1);
						$area3=boxit($width-$shape[0][2]-1,$height,$offsetx+$shape[0][2]+1,$offsety);
						$area4=boxit(($shape[0][2]+1)-$shape[1][2],$shape[1][3],$offsetx+$shape[1][2],$offsety);
					} else {
						$area1=boxit($shape[1][2],$height-$shape[1][3],$offsetx,$offsety+$shape[1][3]);
						$area2=boxit($width-$shape[1][2],$height-$shape[0][3]-1,$offsetx+$shape[1][2],$offsety+$shape[0][3]+1);
						$area3=boxit($width-$shape[0][2]-1,$shape[0][3]+1,$offsetx+$shape[0][2]+1,$offsety);
						$area4=boxit($shape[0][2]+1,$shape[1][3],$offsetx,$offsety);
					}
					$answer=merge($area1,$area2,$area3,$area4,$shape);
					return $answer;
				}
			} return 0;
		}
		function merge($area1,$area2,$area3,$area4,$shape){
			$rand=rand(0,$shape[0][0]-$shape[1][0]);
			$width=$shape[1][0]+$rand;
			$rand=rand(0,$shape[0][1]-$shape[1][1]);
			$height=$shape[1][1]+$rand;
			$area=((($shape[0][0]+1)-$shape[1][0])*(($shape[0][1]+1)-$shape[1][1]));
			$answer=array(array($width,$height,$area,$shape[0][1],$shape[0][0],$shape[1][1],$shape[1][0]));
			if($area1!=0){
				$answer=array_merge($answer,$area1);
			}
			if($area2!=0){
				$answer=array_merge($answer,$area2);
			}
			if($area3!=0){
				$answer=array_merge($answer,$area3);
			}
			if($area4!=0){
				$answer=array_merge($answer,$area4);
			}
			return $answer;
		}
		function shape($shapes,$bigbox,$pwidth,$pheight,$width,$height,$offsetx,$offsety){
			$pivots=array();
			for ($i = 0; $i <= $bigbox-1; $i++) {
				array_push($pivots,$i);
			}
			$rand=rand(0,count($shapes)-1);
			if($shapes[$rand][0]&&$shapes[$rand][0]){
				$return=pivot($pivots,$shapes[$rand],$pwidth,$pheight,$width,$height,$offsetx,$offsety);
			} else {
				$return=0;
			}
			if($return){
				return $return;
			} else {
				unset($shapes[$rand]);
				$shapes=array_values($shapes);
				if($shapes!=array()){
					return shape($shapes,$bigbox,$pwidth,$pheight,$width,$height,$offsetx,$offsety);
				} else {
					return 0;
				}
			}
		}
		function findposition($sum,$k){
			$q=0;
			$p=0;
			$test=0;
			for ($i= 0; $i < $sum[0]; $i++) {//for each row
				for ($j = 0; $j < $sum[1]; $j++) {//for each colum
					if($q==$k){
						return array($i,$j);
					}
					$q++;
				}
			}
		}
		function pivot($pivots,$sum,$x,$y,$width,$height,$offsetx,$offsety){
			$rand=rand(0,count($pivots)-1);
			$pivot=$pivots[$rand];
			unset($pivots[$rand]);
			$pivots=array_values($pivots);
			$answer0=array();
			$test=1;
			$position=findposition($sum,$pivot);
			for ($i= 0; $i < $sum[0]; $i++) {//for each row
				for ($j = 0; $j < $sum[1]; $j++) {//for each colum
					$relativei=$i-$position[0];
					$relativej=$j-$position[1];
					if($x+$relativei<0||$x+$relativei>=$width||$y+$relativej<0||$y+$relativej>=$height){//testing that the shape been tried doesn't go outside of the puzzle
						$test=0;
					}
					if($test){
						/* store the values if they are valid*/
						array_push($answer0,array($x+$relativei+$offsetx,$y+$relativej+$offsety,$x+$relativei,$y+$relativej));
					}
				}
			}
			if($test){
				$answer1=array();
				array_push($answer1,array_pop($answer0));
				array_push($answer1,array_shift($answer0));
				return $answer1;
			} else {
				if($pivots==array()){
					return 0;
				} else {
					return pivot($pivots,$sum,$x,$y,$width,$height,$offsetx,$offsety);
				}
			}
		}
		function getshapes($n,$width,$height){
			$factors=array();
			if($n<=$width){
				array_push($factors,array($n,1));
			}
			$m=$n%2;
			$m=$n/2-$m/2;
			while($m!=0){
				if($n%$m==0&&($n/$m)<=$height&&$m<=$width){
					array_push($factors,array($m,$n/$m));
				}
				$m--;
			}
			array_unshift($factors,array_pop($factors));
			return $factors;
		}
	?>
 </table>
<div class="noPrint">
 <button onclick="start_edit();" id="editbtn" class="sexybutton">Edit</button>
 <font class="edit" id="edit">
	 &nbsp; &nbsp; <button class="sexybutton" onclick="clear_puzzle();">Clear puzzle</button>
 </font>
 <font class="" id="nonedit">
 <button onclick="hint_me()" class="sexybutton">Hint</button>  
 <button onclick="solve_it()" class="sexybutton">Solve</button> 
 <button onclick="javascript:location.reload(true)" class="sexybutton">New Puzzle</button> 
 <input type="button" value="Print" onClick="printme()" class="sexybutton" />  
 <input type="button" value="Check Answer" class="sexybutton" onClick="check_answer()" />
</div>
 <div style="display:table-cell;display:inline-block;vertical-align:top" id="time">
 <?php
 	echo "(Generated in) ";
	echo round(gentime(),2);
	echo " seconds";
 ?>
 </div><br>
  <div style="display:table-cell;display:inline-block;vertical-align:top" id="time2">
  &nbsp;
 </div>
 </font>
 <br><div class="edit" style="display:table-cell;display:inline-block;vertical-align:top;background-color:pink" id="errbox"></div>
</body>
</html>
