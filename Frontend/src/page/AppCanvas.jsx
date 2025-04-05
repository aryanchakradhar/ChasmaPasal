import { useRef, useEffect } from 'react';
import { JEELIZVTO, JEELIZVTOWIDGET } from 'jeelizvtowidget';
import searchImage from '../assets/target512.jpg';
import { useParams } from 'react-router-dom';

function init_VTOWidget(placeHolder, canvas, toggle_loading, sku) {
  JEELIZVTOWIDGET.start({
    placeHolder,
    canvas,
    callbacks: {
      ADJUST_START: null,
      ADJUST_END: null,
      LOADING_START: toggle_loading.bind(null, true),
      LOADING_END: toggle_loading.bind(null, false)
    },
    sku: sku, // SKU loaded at the beginning
    searchImageMask: searchImage,
    searchImageColor: 0xeeeeee, // color of loading (face not found) animation
    searchImageRotationSpeed: -0.001, // negative -> clockwise
    callbackReady: function() {
      console.log('INFO: JEELIZVTOWIDGET is ready :)');
    },
    onError: function(errorLabel) {
      alert('An error happened. errorLabel =' + errorLabel);
      switch (errorLabel) {
        case 'WEBCAM_UNAVAILABLE':
          break;
        case 'INVALID_SKU':
          break;
        case 'PLACEHOLDER_NULL_WIDTH':
        case 'PLACEHOLDER_NULL_HEIGHT':
          break;
        case 'FATAL':
        default:
          break;
      }
    }
  });
}

function AppCanvas() {
  const refPlaceHolder = useRef(null);
  const refCanvas = useRef(null);
  const refAdjustEnter = useRef(null);
  const refAdjust = useRef(null);
  const refLoading = useRef(null);
  const { sku } = useParams();

  const toggle_loading = (isLoadingVisible) => {
    if (refLoading.current) {
      refLoading.current.style.display = isLoadingVisible ? 'block' : 'none';
    }
  };

  const enter_adjustMode = () => {
    JEELIZVTOWIDGET.enter_adjustMode();
    if (refAdjustEnter.current) refAdjustEnter.current.style.display = 'none';
    if (refAdjust.current) refAdjust.current.style.display = 'block';
  };

  const exit_adjustMode = () => {
    JEELIZVTOWIDGET.exit_adjustMode();
    if (refAdjustEnter.current) refAdjustEnter.current.style.display = 'block';
    if (refAdjust.current) refAdjust.current.style.display = 'none';
  };

  const set_glassesModel = (sku) => {
    JEELIZVTOWIDGET.load(sku);
  };

  useEffect(() => {
    const placeHolder = refPlaceHolder.current;
    const canvas = refCanvas.current;
    init_VTOWidget(placeHolder, canvas, toggle_loading, sku);

    return () => {
      JEELIZVTOWIDGET.destroy();
    };
  }, [sku]);

  return (
    <div ref={refPlaceHolder} className='JeelizVTOWidget'>
      <canvas ref={refCanvas} className='JeelizVTOWidgetCanvas'></canvas>
      
      <div ref={refAdjustEnter} className='JeelizVTOWidgetControls'>
        <button className='JeelizVTOWidgetButton JeelizVTOWidgetAdjustEnterButton' onClick={enter_adjustMode}>
          Adjust
        </button>
      </div>

      <div ref={refAdjust} className='JeelizVTOWidgetAdjustNotice'>
        Move the glasses to adjust them.
        <button className='JeelizVTOWidgetButton JeelizVTOWidgetAdjustExitButton' onClick={exit_adjustMode}>
          Quit
        </button>
      </div>

      <div ref={refLoading} className='JeelizVTOWidgetLoading'>
        <div className='JeelizVTOWidgetLoadingText'>
          LOADING...
        </div>
      </div>
    </div>
  );
}

export default AppCanvas;
