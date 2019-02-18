

> **04/17/2018**three.js 学习之自转的地球
      

首先需要知道什么是 three.js。 简单的说，three.js 是一个非常优秀的 WebGL 开源框架, three(3d) + js(javaScript)。其开源项目的地址：

> 
github: https://github.com/mrdoob/three.js

而 WebGL 是在浏览器中实现三维效果的一套规范。

在 three.js 中有几大重要的概念需要先了解一下：

- 场景（scene）
- 相机（camera）
- 渲染器（renderer）

<!-- -->

**关键**：有了这三样东西，我们才能够使用相机将场景渲染到网页上去`
####1、scene
在 WebGL 世界里，场景是一个非常重要的概念，它是存放所有物体的容器。在 three.js 里面新建一个场景很简单，new THREE.Scene 实例就好了。代码如下：

> 
var scene = new THREE.Scene();  // 场景只有一种

####2、camera
- 相机（camera）

<!-- -->

> 
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000) ;

PerspectiveCamera( fov, aspect, near, far )

- fov(Number): 仰角的角度
- aspect(Number): 截平面长宽比，多为画布的长宽比。
- near(Number): 近面的距离
- far(Number): 远面的距离

<!-- -->

图解 THREE.PerspectiveCamera 参数，如下:
![](https://tse3-mm.cn.bing.net/th?id=OIP.3Jjn7ZAyk9IZUQWgLklF2AHaDn&amp;w=300&amp;h=300&amp;p=0&amp;o=5&amp;pid=1.7)
####3、renderer
渲染器决定了渲染的结果应该画在页面的什么元素上面，并且以怎样的方式来绘制。

```
 var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

好了，几大概念简单的说了，还不是很明白也不打紧，先看下最终的效果：

![](http://bluestest.oss-cn-shanghai.aliyuncs.com/earth.gif)
####开始画地球
1、导入 three.min.js文件，可以下载到本地，也可以采用 cdn, 我这里采用的是下载下来的方式：

> 
&lt;script src=&quot;assets/plus/threejs/three.min.js&quot;&gt;&lt;/script&gt;

或者

> 
&lt;script src=&quot;https://cdn.bootcss.com/three.js/r83/three.min.js&quot;&gt;&lt;/script&gt;

2、准备渲染器 renderer 的 domElement 元素

> 
&lt;div id=&quot;canvas-frame&quot;&gt;&lt;/div&gt;

&lt;style&gt;&lt;/style&gt;中加入 css:

```
 div#canvas-frame {
   border: none;
   cursor: pointer;
   width: 100%;
   height: 100vh;
   background-color: #EEEEEE;
}
```

3、实例化一个 scence 对象, 用来存放我们的地球实体。

```
// 场景
var scene;
function initScene() {
 scene = new THREE.Scene();
}
```

4、准备搭建 camera 的位置，和调节角度,在 three.js 里面采用给的是右手坐标系：

```
// 相机
var camera;
function initCamera() {
 camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
 camera.position.x = -500;
 camera.position.y = 500;
 camera.position.z = -500;
}
```

这里采用的是透视相机。 视角越大，看到的场景越大，那么中间的物体相对于整个场景来说，就越小了。

5、准备渲染器 renderer

```
// 渲染器
var renderer;
function initThree() {
 width = document.getElementById(&#39;canvas-frame&#39;).clientWidth;
 height = document.getElementById(&#39;canvas-frame&#39;).clientHeight;
 // 实例化 THREE.WebGLRenderer 对象。
 renderer = new THREE.WebGLRenderer({
                      antialias: true,
                      alpha: true,
                      canvas: renderer
                    });
 // 设置 renderer 的大小
 renderer.setSize(width, height);
 // 挂载到准备的 domElement 上
 document.getElementById(&#39;canvas-frame&#39;).appendChild(renderer.domElement); 
 // Sets the clear color and opacity.
 renderer.setClearColor(0x000000, 1.0);
}
```

这里对 THREE.WebGLRenderer 实例的参数进行讲解。

- canvas- 渲染器绘制输出的那个 canvas, 这对应于下面的 domElement 属性。如果没有在设置，则会创建一个新的画布元素。
- antialias- 抗锯齿化
- alpha- alpha 缓冲区

<!-- -->

6、画地球啦，这里的地球其实就是在一个球体上贴上带有地球纹路的贴纸。

```
// 地球
var earthMesh;
function initEarth() {
  // 实例化一个半径为 200 的球体
 var earthGeo = new THREE.SphereGeometry(200, 100, 100);
 var earthMater = new THREE.MeshPhongMaterial({
          map: new THREE.TextureLoader().load(&#39;./assets/earth.jpg&#39;)
      });
 earthMesh = new THREE.Mesh(earthGeo, earthMater);
 scene.add(earthMesh);
}
```

7、给地球加上云层；

```
// 云
var cloudsMesh;
function initClouds() {

  // 实例化一个球体，半径要比地球的大一点，从而实现云飘咋地球上的感觉
  var cloudsGeo = new THREE.SphereGeometry(201, 100, 100);
  
  // transparent 与 opacity 搭配使用，设置材质的透明度，当 transparent 设为 true 时， 会对材质特殊处理，对性能会有些损耗。
  var cloudsMater = new THREE.MeshPhongMaterial({
      alphaMap: new THREE.TextureLoader().load(&#39;./assets/clouds.jpg&#39;),
      transparent: true,
      opacity: 0.2
  });
  
  cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMater);
  scene.add(cloudsMesh);
}
```

到这里地球就画完了，但是，就像现实的世界一样，如果你不给它打点光，世界就是漆黑一片的，所以接下来给我们的 scene 加点光吧。

8、给世界来点光，世界还你一片彩。

```
// 光源
var light;
function initLight() {
  // A light source positioned directly above the scene, with color fading from the sky color to the ground color. 
  // 位于场景正上方的光源，颜色从天空颜色渐变为地面颜色。
  //  var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  // scene.add(light);
  
  // 环境光
  light = new THREE.AmbientLight(0xFFFFFF);
  light.position.set(100, 100, 200);
  scene.add(light);
  
  // 平行光
  // 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
  // light = new THREE.DirectionalLight(0xffffbb, 1);
  // light.position.set(-1, 1, 1);
  // scene.add(light);
}
```

这里采用的是环境光，其它注释了的两种光的效果也不错哦~
直到这里，地球就画出来了，但是我们的题目是画一颗自转的地球，那我们如何让它自己转起来呢？我们继续往下看。

9、引入一个控制器，这里如果你足够厉害自己写也可以哦，我采用的开源的。

```
 &lt;script src=&quot;assets/plus/threejs/js/controls/OrbitControls.js&quot;&gt;&lt;/script&gt;
```

```
 // 载入控制器
var controls = new THREE.OrbitControls(camera, renderer.domElement);
```

10、定义地球和云层自转的动画，速度不一样会更像哦。这里说说为什么循环动画使用的是 requestAnimationFrame, 而不是更熟知的 setInterval？setInterval是到点就往任务队列里插，是 JS 引擎的定时器方法；requestAnimationFrame是跟着浏览器的绘制走，浏览器每次重绘的时候调用，是 DOM 引擎提供的方法。

```
function animate() {
controls.update();
// 地球自转
earthMesh.rotation.y -= 0.002;
// 漂浮的云层
cloudsMesh.rotation.y -= 0.005;
cloudsMesh.rotation.z += 0.005;
renderer.render(scene, camera);
requestAnimationFrame(animate);
}
```

自转的地球到这里就大功告成啦~

完整的代码见：https://github.com/jiangyuzhen/three-earth

```
Tips: 有的小伙伴克隆上面的代码后， 用双击 index.html 的方式看不到效果，可以自己搭一个静态服务或者试试 anywhere (随启随用的静态文件服务器)：
```

步骤如下:

```
// 全局安装
npm i anywhere -g 

// 文件根目录下执行
anywhere
```

####相关资料
- https://threejs.org/
- https://github.com/omni360/three.js.sourcecode
- http://www.hewebgl.com/article/articledir/3

<!-- -->

![](/img/avatar.gif)
开发者小蓝

- [****文章](/)
- [****搜索](/search)
- [****标签](/tags)
- [****关于](/about)

<!-- -->

[](https://github.com/captainblue2013)[](http://weibo.com/lanhaosongzi/profile)[](http://fyscu.com)

[**侧栏导航**](#sidebar)
