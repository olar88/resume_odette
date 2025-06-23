import React, { useRef, useState, useEffect } from "react";
import { fabric } from 'fabric';
import { deleteIcon } from "../../X";
import { useIndexedDB } from "../../entity/useIndexedDB";
import { PageState, PopUpModel } from "../../components/popUpModel";
import DeleteIcon from "../../svg/img_delete";
import { colorEnum } from "../../components/allEnum";
import { useNavigate } from "react-router-dom";

export function FabricTest() {
    const canvasHTMLRef = useRef<HTMLCanvasElement | null>(null);
    const canvasRef = useRef<fabric.Canvas | null>(null);
    const selectItem = useRef<fabric.Object | null>(null);
    const [count, setCount] = useState<number>(1)
    const [gridGroup, setGridGroup] = useState<fabric.Group | null>(null)
    const { setItem, getItem, removeItem, clear } = useIndexedDB()
    const [pageState, setPageState] = useState<PageState>({
        isLoaded: false,
        modelOpen: false,
        modelInner: null,
    })
    const navigate = useNavigate()

    /** 旋轉角度 */
    const rotateAngles = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360];
    const grid = 5//格子大小

    // 隨機顏色
    const colors = [
        '#FF7F50',
        '#5F9EA0',
        '#FF8C00',
        '#E9967A',
        '#8FBC8F',
        '#00CED1',
        '#228B22',
        '#B22222',
        '#4B0082',
        '#DB7093',
    ];

    /** 新增正方形 */
    const addSquare = () => {
        const canvas = canvasRef.current
        if (canvas) {
            const rect = new fabric.Rect({
                left: 10,
                top: 10,
                width: 50,
                height: 50,
                fill: colors[Math.floor(Math.random() * 10)],
            });

            rect.on('mousedown', () => {
                selectItem.current = rect
            })

            rect.set({
                selectable: true, // 可以被選擇。
                hasControls: true, // 縮放/旋轉控制
                cornerStyle: 'circle',
            });

            // 調整縮放鈕顯示
            rect.setControlsVisibility({
                bl: true, // 左下
                br: true, // 右下
                mb: false, // 下中
                ml: false, // 中左
                mr: false, // 中右
                mt: false, // 上中
                tl: true, // 上左
                tr: true, // 上右
                mtr: true // 旋轉控制鍵
            })
            // 設置自定義 ID
            rect.set('id' as keyof fabric.Object, 'iddd--' + count + 1);

            setCount(prev => {
                return prev + 1
            })
            canvas.add(rect);
            return rect
        } else {
            return null
        }
    };

    /** 新增圓形 */
    const addCircle = () => {
        const canvas = canvasRef.current
        if (canvas) {
            const circle = new fabric.Circle({
                left: 60,
                top: 60,
                radius: 20,
                startAngle: 0,
                endAngle: 360,
                fill: colors[Math.floor(Math.random() * 10)],
            });

            circle.on('mousedown', () => {
                selectItem.current = circle
            })

            // 一般屬性設定
            circle.set({
                selectable: true, // 可以被選擇。
                hasControls: true, // 縮放/旋轉控制
                cornerStyle: 'circle',
            });

            // 設置自定義 ID
            circle.set('id' as keyof fabric.Object, 'iddd--' + count + 1);

            setCount(prev => {
                return prev + 1
            })
            canvas.add(circle);
            return circle
        } else {
            return null
        }
    };

    /** 新增文字 */
    const addText = () => {
        const canvas = canvasRef.current
        if (canvas) {
            const Text = new fabric.IText('雙擊我編輯', {
                left: 120,
                top: 120,
                fontFamily: 'Microsoft JhengHei',　// 字型
                fontSize: 20, // 字體大小
                fontWeight: 'bold',　// 字體粗細
                fill: '#dc3545'//字體顏色
            });

            Text.on('mousedown', () => {
                selectItem.current = Text
            })

            // 一般屬性設定
            Text.set({
                selectable: true, // 可以被選擇。
                hasControls: true, // 縮放/旋轉控制
                cornerStyle: 'circle',
            });

            // 調整縮放鈕顯示
            Text.setControlsVisibility({
                bl: true, // 左下
                br: true, // 右下
                mb: false, // 下中
                ml: false, // 中左
                mr: false, // 中右
                mt: false, // 上中
                tl: true, // 上左
                tr: true, // 上右
                mtr: true // 旋轉控制鍵
            })
            // 設置自定義 ID
            Text.set('id' as keyof fabric.Object, 'iddd--' + count + 1);

            setCount(prev => {
                return prev + 1
            })
            canvas.add(Text);
            return Text
        } else {
            return null
        }
    };

    /** 新增組合 */
    const addUnit = () => {
        const canvas = canvasRef.current
        if (canvas) {
            const Text = new fabric.Textbox('群組' + count, {
                left: 10,
                top: 60,
                fontFamily: 'Microsoft JhengHei',　// 字型
                fontSize: 20, // 字體大小
                fontWeight: 'bold',　// 字體粗細
                fill: colors[Math.floor(Math.random() * 10)]//字體顏色
            });

            const rect = new fabric.Rect({
                left: 10,
                top: 10,
                width: 50,
                height: 50,
                fill: colors[Math.floor(Math.random() * 10)],
            });

            const group = new fabric.Group([rect, Text], {
                originX: 'center',
                originY: 'center',
                subTargetCheck: true, // 子項不可被選擇
                selectable: true, // 可以被選擇。
                hasControls: true, // 縮放/旋轉控制
                cornerStyle: 'rect',
            })

            group.on('mousedown', () => {
                selectItem.current = Text
            })

            // 一般屬性設定
            group.set({
                selectable: true, // 可以被選擇。
                hasControls: true, // 縮放/旋轉控制
                cornerStyle: 'circle',
            });

            // 調整縮放鈕顯示
            group.setControlsVisibility({
                bl: true, // 左下
                br: true, // 右下
                mb: false, // 下中
                ml: false, // 中左
                mr: false, // 中右
                mt: false, // 上中
                tl: true, // 上左
                tr: true, // 上右
                mtr: true // 旋轉控制鍵
            })
            // 設置自定義 ID
            group.set('id' as keyof fabric.Object, 'group--iddd--' + count + 1);

            setCount(prev => {
                return prev + 1
            })
            canvas.add(group);
            return group
        } else {
            return null
        }
    };

    // #region SVG匯出匯入功能區
    /** 匯出 SVG */
    function downloadSVG() {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const svg = canvas.toSVG({
                suppressPreamble: true, // 禁止添加 XML 聲明
            });

            // 在 SVG 字符串中尋找所有帶有 <image> 子元素的 <g> 元素，並為這些 <g> 元素新增 class="backGround_Pic"
            const modifiedSVG = svg.replace(/<g[^>]*?>\s*<image[^>]*?>/g, match => {
                // 在 <g> 元素上添加對應的 className
                return match.replace('<g ', `<g id="backGround_Pic" `);
            });
            const blob = new Blob([modifiedSVG], { type: 'image/svg+xml' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'canvas.svg';
            link.click();
        }
    }

    /** 讀取匯入 SVG */
    function handleLoadSVG(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            // 解析檔案成為字串
            reader.onload = (e) => {
                const svgString = e.target?.result as string;
                importFromSVG(svgString);
            };
            // 開始讀取檔案
            reader.readAsText(file);
        }
    }

    /** 匯入 SVG */
    async function importFromSVG(svgString: string) {
        const canvas = canvasRef.current;
        if (canvas) {
            // 先清空內容
            removeGrid()
            canvas.clear()

            fabric.loadSVGFromString(svgString, (objects, options: ISvgOptions) => {
                // 設定 Canvas 的大小為
                canvasRef.current!.setWidth(options.width ?? 0);
                canvasRef.current!.setHeight(options.height ?? 0);

                // 將物件一一放入
                objects.forEach((obj, index) => {
                    // 檢查是否為背景 'backGround_Pic'
                    if (obj instanceof fabric.Object && obj.get('id' as keyof fabric.Object)?.includes('backGround_Pic')) {
                        // 設置為背景
                        canvas.setBackgroundImage(obj.toDataURL({}), () => {
                            canvas.renderAll();
                        });
                    }
                    // 檢查是否為線圖 'backGround_Grid'
                    else if (obj instanceof fabric.Object && obj.get('id' as keyof fabric.Object)?.includes('backGround_Grid')) {
                        // 不將背景線放入物件
                    }
                    else {
                        // 沒有群組屬性的物件直接加入
                        canvas.add(obj);
                    }
                });
                canvas.renderAll();
                createGrid(true)
            });
        }
    }
    // #endregion 

    // #region JSON 匯出匯入功能區
    /** 匯出 JSON */
    const downloadJSON = () => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            // 保存我要的 attribute
            const jsonString = JSON.stringify(canvas.toJSON(['id']));
            const blob = new Blob([jsonString], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'canvas.json';
            link.click();
        }
    };

    /** 匯入 JSON */
    function handleLoadJson(event: React.ChangeEvent<HTMLInputElement>) {
        // 取得檔案 
        const file = event.target.files?.[0],
            canvas = canvasRef.current;
        if (file) {
            const reader = new FileReader();
            // 解析檔案成為字串
            reader.onload = (e) => {
                /** 將檔案轉為字串 */
                const JSONString = e.target?.result as string,
                    /** 解析JSON */
                    parsedJson = JSON.parse(JSONString);

                if (canvas) {
                    // 先清空內容
                    removeGrid()
                    canvas.clear()

                    // 設定Canvas大小
                    if (parsedJson?.width && parsedJson?.height) {
                        canvas.setDimensions({
                            width: parsedJson.backgroundImage.width,
                            height: parsedJson.backgroundImage.height
                        }, {
                            // backstoreOnly: true 可以避免 Canvas 視覺上的重繪
                            backstoreOnly: true
                        });
                    }

                    // 設定 Canvas 的大小為
                    canvas.setWidth(parsedJson.backgroundImage.width || 0);
                    canvas.setHeight(parsedJson.backgroundImage.height || 0);

                    // 讀取 JSON
                    canvas.loadFromJSON(parsedJson, () => {
                        canvas.renderAll();
                        // 主動設定背景線 selectable 與 evented = false
                        canvas._objects.forEach(obj => {
                            if (obj.type === 'group') {
                                const group = obj as fabric.Group
                                // 若已有一個全是線樣的 group => 表示為背景格線
                                if (!group._objects.find(childObj => childObj.type !== "line")) {
                                    obj.selectable = false
                                    obj.evented = false
                                }
                                // 沒有的話產生格線
                                else {
                                    createGrid(true)
                                }
                            }
                        })
                    });
                }
            };
            // 開始讀取檔案
            reader.readAsText(file);
        }
    }

    function openSaveModel() {
        let id: string | null = null,
            syncId = (newId: string | null) => { id = newId }
        setPageState(prev => ({
            ...prev,
            modelOpen: true,
            modelInner: {
                id: "openSaveModel",
                title: "儲存暫存檔",
                modelInner: <ModelLoadInner
                    saveFunc={syncId} />,
                modelAction: () => { if (id) saveLocalJson(id) },
                size: 'medium'
            }
        }))
    }
    /** 暫存 JSON */
    function saveLocalJson(id: string) {
        /** 匯出 JSON */
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            // 保存我要的 attribute
            const jsonString = JSON.stringify(canvas.toJSON(['id']));
            setItem(id, jsonString)
        }
        setPageState(prev => ({
            ...prev,
            modelOpen: false,
            modelInner: null
        }))
    }

    /** 打開暫存 model */
    function openLoadModel() {
        let selectKey = ""
        setPageState(prev => ({
            ...prev,
            modelOpen: true,
            modelInner: {
                id: "openLoadModel",
                title: "選擇暫存檔",
                modelInner: <ModelLoadInner selectFunc={(id) => { selectKey = id }} />,
                modelAction: () => loadLocalJson(selectKey),
                size: 'medium'
            }
        }))
    }
    /** 讀取本地 JSON */
    async function loadLocalJson(key: string) {
        // 取得檔案 
        const canvas = canvasRef.current;
        /** 將檔案轉為字串 */
        const JSONString = await getItem<string>(key)
        /** 解析JSON */

        if (JSONString) {
            const parsedJson = JSON.parse(JSONString);
            if (canvas) {
                console.log("parsedJson", parsedJson, parsedJson?.width);

                // 先清空內容
                removeGrid()
                canvas.clear()

                // 設定Canvas大小
                if (parsedJson?.width && parsedJson?.height) {
                    canvas.setDimensions({
                        width: parsedJson.backgroundImage?.width,
                        height: parsedJson.backgroundImage?.height
                    }, {
                        // backstoreOnly: true 可以避免 Canvas 視覺上的重繪
                        backstoreOnly: true
                    });
                }

                // 設定 Canvas 的大小為
                canvas.setWidth(parsedJson.backgroundImage?.width ?? 500);
                canvas.setHeight(parsedJson.backgroundImage?.height ?? 500);

                // 讀取 JSON
                canvas.loadFromJSON(parsedJson, () => {
                    canvas.renderAll();
                    // 主動設定背景線 selectable 與 evented = false
                    canvas._objects.forEach(obj => {
                        if (obj.type === 'group') {
                            const group = obj as fabric.Group
                            // 若已有一個全是線樣的 group => 表示為背景格線
                            if (!group._objects.find(childObj => childObj.type !== "line")) {
                                obj.selectable = false
                                obj.evented = false
                            }
                            // 沒有的話產生格線
                            else {
                                createGrid(true)
                            }
                        }
                    })
                });
            }
        }
        setPageState(prev => ({
            ...prev,
            modelOpen: false,
            modelInner: null
        }))
    }
    // #endregion 

    // #region 背景圖片功能區
    /** 讀取背景圖片 */
    function readBackGround(event: React.ChangeEvent<HTMLInputElement> | null) {
        if (event) {
            const file = event.target.files![0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const dataUrl = e.target?.result as string;
                    // 在文件讀取完成後，使用 Image 對象獲取寬高
                    const img = new Image();
                    img.src = dataUrl;
                    img.onload = () => {
                        const width = img.width;
                        const height = img.height;

                        // 在取得寬高後，呼叫 setBackGround
                        setBackGround({
                            bgPic: dataUrl,
                            bgWidth: width,
                            bgHeight: height
                        });
                    };
                };
                // 開始讀取文件
                reader.readAsDataURL(file);
            }
        }
    }

    /** 設定背景圖片 */
    function setBackGround({ bgPic, bgWidth, bgHeight }:
        {
            bgPic: any, bgWidth: number, bgHeight: number
        }) {
        const canvas = canvasRef.current;
        if (bgPic && canvas) {
            // 先清空內容
            removeGrid()
            canvas.clear()

            canvas.setHeight(bgHeight)
            canvas.setWidth(bgWidth)
            canvas.setBackgroundImage(bgPic, canvas.renderAll.bind(canvas));
            createGrid(true)
        }
    }

    // #endregion 背景圖片

    // #region 群組功能區
    /** 設定為群組 */
    function setGroup() {
        const canvas = canvasRef.current
        if (canvas) {
            /** 畫面中所有已選物件 (應是一個 ActiveSelection (Onject) 物件)*/
            const selectedObj = canvas.getActiveObject() as fabric.ActiveSelection,
                selectedArr = canvas.getActiveObjects()
            // 若超過一個物件被選中
            if (selectedArr.length > 1) {
                try {
                    // 將它們組成群組
                    selectedObj.toGroup().set('id' as keyof fabric.Object, 'group--' + count)
                    // 重新 render
                    canvas.requestRenderAll();
                } catch (error) {
                    console.error('設定群組失敗', error);
                }
            } else {
                console.error('請選取複數物件')
            }
        }
    }

    /** 解散群組 */
    function unSetGroup() {
        const canvas = canvasRef.current
        if (canvas) {
            const selectedObj = canvas.getActiveObject() as fabric.ActiveSelection;
            try {
                // 判斷其是否為 group
                if (selectedObj.type === 'group') {
                    // 將 group 化為 ActiveSelection 物件 (可再個別進行動作)
                    selectedObj.toActiveSelection();
                    // 重新 render
                    canvas.requestRenderAll();
                } else {
                    console.error('請選取群組物件')
                }
            } catch (error) {
                console.error('解散群組失敗', error);
            }
        }
    }
    // #endregion

    // #region 圖層功能區
    /** 移上層 */
    function movesUpCoating() {
        const canvas = canvasRef.current
        if (canvas) {
            const selectedObject = canvas.getActiveObject()
            if (selectedObject) {
                selectedObject.bringForward()
            }
        }
    };

    /** 移下層 */
    function movesDownCoating() {
        const canvas = canvasRef.current
        if (canvas) {
            const selectedObject = canvas.getActiveObject()
            if (!!selectedObject && canvas.getObjects().indexOf(selectedObject) > 1) {
                selectedObject.sendBackwards()
                console.log(canvas.getObjects().indexOf(selectedObject));
            }
        }
    };
    // #endregion

    // #region Canvas 功能區
    /** 基礎設定 */
    function initSetting() {
        if (canvasHTMLRef.current && !canvasRef.current) {

            const deleteIconImg = document.createElement('img');
            deleteIconImg.src = deleteIcon;

            const canvas = new fabric.Canvas(canvasHTMLRef.current, {
                selection: true,
                // 設置Canvas寬度(初始化以父層寬高為主)
                width: 500,
                // 設置Canvas高度
                height: 500,

                // 設置Canvas背景色
                // backgroundColor: '#ff88',
            });

            // 將 canvas 設定
            canvasRef.current = canvas

            // #region fabric相關設定

            //# fabric 樣式功能設定
            fabric.Object.prototype.set({
                transparentCorners: false,
                // selection: true,
                borderColor: '#f76c6c',//邊框顏色
                cornerColor: '#f76c6c', //控制點顏色
                cornerSize: 10, //控制點大小
                objectCaching: false,
                hasControls: true, //關閉只能移動不能編輯 : true, 開啟只能移動不能編輯 : false
                hasBorders: true, //開啟去掉邊框 : true, 關閉去掉邊框 : false
                hasRotatingPoint: true, //開啟旋轉功能 : true, 關閉旋轉功能 : false
                lockScalingX: false, //關閉橫向縮放 : true, 開啟橫向縮放 : false
                lockScalingY: false,//關閉直向縮放 : true, 開啟直向縮放 : false
                padding: 0,
                snapAngle: 15,
                cornerStyle: 'circle',
            });

            fabric.Object.prototype.setControlsVisibility({
                bl: true, // 左下
                br: true, // 右下
                mb: false, // 下中
                ml: false, // 中左
                mr: false, // 中右
                mt: false, // 上中
                tl: true, // 上左
                tr: true, // 上右
                mtr: true // 旋轉控制鍵
            })

            //# 自訂控制相關按鈕
            fabric.Object.prototype.controls.deleteControl = new fabric.Control({
                x: 0.59,
                y: -0.59,
                cursorStyle: 'pointer',
                // 當點擊放開時刪除該物件
                mouseUpHandler: (enent, transform) => {
                    let target = transform.target;
                    canvas.remove(target);
                    canvas.requestRenderAll();
                    return true
                },
                // 渲染刪除鈕圖片
                render: (ctx, left, top, styleOverride, fabricObject) => {
                    let size = 15;
                    ctx.save();
                    ctx.translate(left, top);
                    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle ?? 0));
                    ctx.drawImage(deleteIconImg, -size / 2, -size / 2, size, size);
                    ctx.restore();
                },
            });
            // #endregion 

            // #region 物件點擊相關設定

            //# 選擇事件設定
            canvas.on("selection:created", function (obj) {
                // 禁止選中圖層時圖層置於頂部
                canvas.preserveObjectStacking = true;
            });

            //# 限制旋轉依照 15為一度
            canvas.on("object:rotating", function (rotEvtData) {
                const targetObj = rotEvtData.target; // 找到 klass
                if (targetObj) {
                    const angle = targetObj.angle ? targetObj.angle % 360 : 0;
                    for (const element of rotateAngles) {
                        if (angle <= element) {
                            // 使用 rotate 設定旋轉角度
                            targetObj.rotate(element)
                            break;
                        }
                    }
                }
            });

            //# 限制放大縮小依照grid
            canvas.on('object:scaling', (options) => {
                const targetObj = options.target;
                let w: number,
                    h: number,
                    threshold: number,
                    snap: {
                        top: number,
                        left: number,
                        bottom: number,
                        right: number,
                    },
                    dist: {
                        top: number,
                        left: number,
                        bottom: number,
                        right: number,
                    },
                    attrs: {
                        scaleX?: number,
                        scaleY?: number,
                        top?: number,
                        left?: number,

                    }
                if (targetObj) {

                    w = targetObj.width! * targetObj.scaleX!;
                    h = targetObj.height! * targetObj.scaleY!
                    snap = {
                        top: Math.round(targetObj.top! / grid) * grid,
                        left: Math.round(targetObj.left! / grid) * grid,
                        bottom: Math.round((targetObj.top! + h) / grid) * grid,
                        right: Math.round((targetObj.left! + w) / grid) * grid
                    };
                    threshold = grid;
                    dist = {
                        top: Math.abs(snap.top - targetObj.top!),
                        left: Math.abs(snap.left - targetObj.left!),
                        bottom: Math.abs(snap.bottom - targetObj.top! - h),
                        right: Math.abs(snap.right - targetObj.left! - w)
                    };
                    attrs = {
                        scaleX: targetObj.scaleX,
                        scaleY: targetObj.scaleY,
                        top: targetObj.top,
                        left: targetObj.left
                    };

                    const transform = options.transform;
                    if (transform) {
                        switch (transform.corner) {
                            case 'tl':
                                if (dist.left < dist.top && dist.left < threshold) {
                                    attrs.scaleX = (w - (snap.left - targetObj.left!)) / targetObj.width!;
                                    attrs.scaleY = (attrs.scaleX / targetObj.scaleX!) * targetObj.scaleY!;
                                    attrs.top = targetObj.top! + (h - targetObj.height! * attrs.scaleY);
                                    attrs.left = snap.left;
                                } else if (dist.top < threshold) {
                                    attrs.scaleY = (h - (snap.top - targetObj.top!)) / targetObj.height!;
                                    attrs.scaleX = (attrs.scaleY / targetObj.scaleY!) * targetObj.scaleX!;
                                    attrs.left = attrs.left! + (w - targetObj.width! * attrs.scaleX);
                                    attrs.top = snap.top;
                                }
                                break;
                            case 'mt':
                                if (dist.top < threshold) {
                                    attrs.scaleY = (h - (snap.top - targetObj.top!)) / targetObj.height!;
                                    attrs.top = snap.top;
                                }
                                break;
                            case 'tr':
                                if (dist.right < dist.top && dist.right < threshold) {
                                    attrs.scaleX = (snap.right - targetObj.left!) / targetObj.width!;
                                    attrs.scaleY = (attrs.scaleX / targetObj.scaleX!) * targetObj.scaleY!;
                                    attrs.top = targetObj.top! + (h - targetObj.height! * attrs.scaleY);
                                } else if (dist.top < threshold) {
                                    attrs.scaleY = (h - (snap.top - targetObj.top!)) / targetObj.height!;
                                    attrs.scaleX = (attrs.scaleY / targetObj.scaleY!) * targetObj.scaleX!;
                                    attrs.top = snap.top;
                                }
                                break;
                            case 'ml':
                                if (dist.left < threshold) {
                                    attrs.scaleX = (w - (snap.left - targetObj.left!)) / targetObj.width!;
                                    attrs.left = snap.left;
                                }
                                break;
                            case 'mr':
                                if (dist.right < threshold) attrs.scaleX = (snap.right - targetObj.left!) / targetObj.width!;
                                break;
                            case 'bl':
                                if (dist.left < dist.bottom && dist.left < threshold) {
                                    attrs.scaleX = (w - (snap.left - targetObj.left!)) / targetObj.width!;
                                    attrs.scaleY = (attrs.scaleX / targetObj.scaleX!) * targetObj.scaleY!;
                                    attrs.left = snap.left;
                                } else if (dist.bottom < threshold) {
                                    attrs.scaleY = (snap.bottom - targetObj.top!) / targetObj.height!;
                                    attrs.scaleX = (attrs.scaleY / targetObj.scaleY!) * targetObj.scaleX!;
                                    attrs.left = attrs.left! + (w - targetObj.width! * attrs.scaleX);
                                }
                                break;
                            case 'mb':
                                if (dist.bottom < threshold) attrs.scaleY = (snap.bottom - targetObj.top!) / targetObj.height!;
                                break;
                            case 'br':
                                if (dist.right < dist.bottom && dist.right < threshold) {
                                    attrs.scaleX = (snap.right - targetObj.left!) / targetObj.width!;
                                    attrs.scaleY = (attrs.scaleX / targetObj.scaleX!) * targetObj.scaleY!;
                                } else if (dist.bottom < threshold) {
                                    attrs.scaleY = (snap.bottom - targetObj.top!) / targetObj.height!;
                                    attrs.scaleX = (attrs.scaleY / targetObj.scaleY!) * targetObj.scaleX!;
                                }
                                break;
                        }
                    }
                    targetObj.set(attrs);
                }
            });


            // #endregion

            // #region 物件移動相關設定

            //# 移動時調整物件的位置，確保它不會超出畫布
            canvas.on('object:moving', function (movingData) {
                const targetObj = movingData.target;
                if (targetObj) {
                    // if object is too big ignore 當前高度對畫布高度||當前寬度對畫布寬度
                    if (targetObj.height! > targetObj.canvas!.height! || targetObj.width! > targetObj.canvas!.width!) {
                        return;
                    }
                    // 設定物件的座標
                    targetObj.setCoords();
                    targetObj.borderColor = 'red'

                    // top-left 檢查物件的左上角是否超出畫布的上邊緣或左邊緣 => 調整物件的位置，確保它不會超出畫布。
                    // getBoundingRect(獲取當前頁面拖曳元素的位置)
                    if (targetObj.getBoundingRect().top < 0 || targetObj.getBoundingRect().left < 0) {
                        targetObj.top = Math.max(targetObj.top!, targetObj.top! - targetObj.getBoundingRect().top);
                        targetObj.left = Math.max(targetObj.left!, targetObj.left! - targetObj.getBoundingRect().left);
                    }
                    // bot-right 檢查物件的右下角是否超出畫布的下邊緣或右邊緣 => 調整物件的位置，確保它不會超出畫布。
                    if (targetObj.getBoundingRect().top + targetObj.getBoundingRect().height > targetObj.canvas!.height! ||
                        targetObj.getBoundingRect().left + targetObj.getBoundingRect().width > targetObj.canvas!.width!) {
                        targetObj.top = Math.min(targetObj.top!, targetObj.canvas!.height! - targetObj.getBoundingRect().height + targetObj.top! - targetObj.getBoundingRect().top);
                        targetObj.left = Math.min(targetObj.left!, targetObj.canvas!.width! - targetObj.getBoundingRect().width + targetObj.left! - targetObj.getBoundingRect().left);
                    }
                }
            });


            // #endregion 


        }
    }

    function deleteAll() {
        const canvas = canvasRef.current
        if (canvas) {
            canvas.clear()
            createGrid(true)
        }
    }

    // #endregion

    // #region  網格功能區

    /** 網格建立 
     * @param {boolean} must 無論如何重建
     */
    async function createGrid(must?: boolean) {
        const canvas = canvasRef.current
        if (canvas) {
            if (!!gridGroup && !must) {
                return
            } else {
                const gridoption: fabric.ILineOptions = {
                    stroke: '#a8d0e66b',
                    selectable: false,
                    evented: false,
                    strokeWidth: .8
                };

                let gridLines: fabric.Line[] = [],
                    canvasWidth = canvas.width ?? 0;

                // 產生網格
                for (let i = 0; i < (canvasWidth / grid); i++) {
                    gridLines.push(new fabric.Line([i * grid, 0, i * grid, canvasWidth], gridoption));
                    gridLines.push(new fabric.Line([0, i * grid, canvasWidth, i * grid], gridoption));
                }
                // 移動感觸
                canvas.on('object:moving', function (options) {
                    const target = options.target as fabric.Object;
                    if (target) {
                        target.set({
                            left: Math.round(target.left! / grid) * grid,
                            top: Math.round(target.top! / grid) * grid,
                        });
                    }
                });
                const newGrid = new fabric.Group(gridLines, {
                    selectable: false,
                    evented: false,
                })
                // 將背景格id設為 'backGround_Grid'
                newGrid.set('id' as keyof fabric.Group, 'backGround_Grid')

                setGridGroup(newGrid)
            }
        }
    };

    /** 清除網格 */
    async function removeGrid() {
        if (!!gridGroup) {
            setGridGroup(null)
            canvasRef.current!.remove(gridGroup);
        }
    };

    // #endregion

    useEffect(() => {
        initSetting()
        createGrid()
    }, []);

    // 網格重新設定進 canvas
    useEffect(() => {
        if (!!gridGroup) {
            // 將群組移動到最底層
            canvasRef.current!.moveTo(gridGroup, 0)
            // canvasRef.current!.add(gridGroup);

        }
    }, [gridGroup])

    return <div className="w100 h100">
        <div className="d-flex w-100 h-100">
            {/* 控制鈕 */}
            <div className="canvas-control-box d-flex flex-column overflow-auto col-2 justify-content-center" style={{}}>
                {/* JSON */}
                {/* <button onClick={downloadJSON} className="my-btn sm-btn btn-alert m-2">下載JSON</button>
                    <button onClick={() => { (document.querySelector('#LoadJson') as HTMLInputElement)!.click() }} className="my-btn sm-btn btn-alert m-2">
                        匯入JSON
                    </button> 
                     <input id='LoadJson' className="d-none" type="file" accept=".json" onChange={handleLoadJson} />*/}

                {/* BackGround */}
                <button onClick={() => { (document.querySelector('#LoadBGround') as HTMLInputElement)!.click() }} className="my-btn sm-btn btn-dark m-2">匯入背景</button>
                <input id='LoadBGround' className="d-none" type="file" accept="image/png, image/jpeg" onChange={(e) => { readBackGround(e) }} />
                <button onClick={() => { (document.querySelector('#LoadSVG') as HTMLInputElement)!.click() }} className="my-btn sm-btn btn-dark m-2">
                    匯入圖檔
                </button>
                <input id='LoadSVG' className="d-none" type="file" accept=".svg" onChange={handleLoadSVG} />
                {/* 畫布渲染 */}
                <button onClick={addSquare} className="my-btn sm-btn btn-primary m-2">新增矩形</button>
                <button onClick={addCircle} className="my-btn sm-btn btn-primary m-2">新增圓形</button>
                <button onClick={addText} className="my-btn sm-btn btn-primary m-2">新增文字</button>

                <div className="d-flex flex-row">
                    <button onClick={() => createGrid()} className="my-btn sm-btn btn-dark m-2 w-50">添加網格</button>
                    <button onClick={removeGrid} className="my-btn sm-btn btn-dark m-2 w-50">移除網格</button>
                </div>
                <br />

                <button onClick={setGroup} className="my-btn sm-btn btn-secondary m-2">結合為群組</button>
                <button onClick={unSetGroup} className="my-btn sm-btn btn-secondary m-2">解散群組</button>
                <br />

                <div className="d-flex flex-row">
                    <button onClick={movesUpCoating} className="my-btn sm-btn btn-secondary m-2 w-50">移至上層</button>
                    <button onClick={movesDownCoating} className="my-btn sm-btn btn-secondary m-2 w-50">移至下層</button>
                </div>
                <hr />

                {/* SVG */}
                <button onClick={downloadSVG} className="my-btn sm-btn btn-alert m-2 ">下載 SVG</button>
                <button onClick={openSaveModel} className="my-btn sm-btn btn-alert m-2">暫存 </button>
                <button onClick={openLoadModel} className="my-btn sm-btn btn-alert m-2">讀取暫存 </button>
                <button onClick={deleteAll} className="my-btn sm-btn btn-dark m-2">清除全部 </button>
                <button onClick={() => {
                    navigate("/")
                }} className="my-btn sm-btn btn-dark m-2">返回主頁 </button>
            </div>

            {/* 畫布 */}
            <div className="canvas_outside_container p-1 overflow-auto col-10 d-flex flex-column justify-content-center" style={{}}>
                <canvas ref={canvasHTMLRef} style={{ minHeight: '50%' }} />
            </div>
        </div>
        <PopUpModel
            modelOpen={pageState.modelOpen}
            modelInner={pageState.modelInner}
            closeFnc={() => { setPageState(prev => ({ ...prev, modelOpen: false })) }}
        />
    </div>
}

/** ISvgOptions 
 * @param height: SVG 高度。
 * @param width: SVG 寬度。
 * @param viewBox: SVG 的視圖框。
 * @param preserveAspectRatio: 保持約束比例的屬性。
 * @param backgroundImage: 背景圖片。
 * @param overlayImage: 覆蓋在 SVG 上的圖片。
 * @param clipPath: 剪切路徑。
 * @param crossOrigin: 圖片的跨域屬性。
 * @param imageSmoothingEnabled: 啟用圖片平滑處理。
 * @param backgroundColor: 背景顏色。
 * @param selection: 是否啟用選擇。
 * @param clipTo: 剪切函數。
 * @param viewBoxTransform: 視圖框轉換。
 * @param parserOptions: 解析器選項。
 * @param document: SVG 文件。
 */
interface ISvgOptions {
    width?: number;
    height?: number;
    viewBox?: string;
    preserveAspectRatio?: string;
    backgroundImage?: string | HTMLImageElement;
    overlayImage?: string | HTMLImageElement;
    clipPath?: string | HTMLImageElement;
    crossOrigin?: string;
    imageSmoothingEnabled?: boolean;
    backgroundColor?: string;
    selection?: boolean;
    clipTo?: any; // 設定 clipTo 函數的回呼
    viewBoxTransform?: number[];
    document: XMLDocument;
}

function ModelLoadInner(props: {
    selectFunc?: (id: string) => void
    saveFunc?: (id: string | null) => void
}) {
    const { setItem, getAllItem, removeItem } = useIndexedDB()
    const [allData, setAllData] = useState<string[]>([])
    const [saveKey, setSaveKey] = useState<string>("")
    const [selectKey, setSelectKey] = useState<string>("")

    /** 初始化查詢暫存 */
    async function init() {
        await getAllItem().then((res) => {
            setAllData((res as string[]) ?? [])
        })
    }

    /** 輸入暫存名稱 */
    function handleInput(value: string) {
        setSaveKey(value)
    }

    /** 選擇暫存檔 */
    function handleSelect(value: string) {
        setSelectKey(value)
    }

    function deleteSelect(value: string) {
        removeItem(value)
        init()
    }

    useEffect(() => {
        init()
    }, [])

    useEffect(() => {
        if (props.saveFunc) {
            props.saveFunc(saveKey)
        }
    }, [saveKey])

    useEffect(() => {
        if (props.selectFunc) {
            props.selectFunc(selectKey)
        }
    }, [selectKey])

    return <React.Fragment>
        <div className="tableContaniner">

            {props.selectFunc
                ? allData.map((ele) => {
                    return <div key={ele}
                        onClick={() => { handleSelect(ele) }}
                        className={`d-flex justify-content-between  tableCell ` + (selectKey === ele ? "selected" : "")}
                    >
                        <span>{ele}</span>
                        <DeleteIcon className="iconBtn" style={{ width: "30px" }}
                            fill={colorEnum.alert}
                            onClick={(e) => {
                                e.stopPropagation()
                                deleteSelect(ele)
                            }} />
                    </div>
                })
                : null}
            {props.saveFunc
                ? <React.Fragment>
                    <input className="modelInput"
                        value={saveKey}
                        placeholder="請輸入暫存檔名"
                        onChange={(e) => {
                            handleInput(e.target.value.toString())
                        }} />
                    <div className="warning_label">
                        {allData.some((dataKey) => dataKey === saveKey)
                            ? "檔案名勿重複，重複名稱將視為覆蓋檔案" : ""}
                    </div>
                </React.Fragment>
                : null}

        </div>
    </React.Fragment>
}