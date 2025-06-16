import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation  } from 'react-router-dom';
import CreateNewLandmark from "./CreateNewLandmark.jsx";
import LandmarkDescription from "./LandmarkDescription.jsx";
import { useAuth } from './AuthContext.jsx';
import mapStyles from '../css/map.module.css';

function Map() {

  const DEBOUNCE_DELAY = 500; 
  const [position, setPosition] = useState(null);
  const markerRef = useRef(null); // referencia na marker
  const [createLandmarkOpened, setCreateLandmarkOpened] = useState(false);
  const [landmarkDescriptionOpened, setLandmarkDescriptionOpened] = useState(false);
  const { landmarks, checkAuth, isLoggedIn, fetchAllLandmarks } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentLandmark, setCurrentLandmark] = useState(null);
  const mapRef = useRef(null);
    


  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [targetLandmark, setTargetLandmark] = useState(null);

  useEffect(() => {
    if (location.state) {
      const landmarkId = location.state.centerOnLandmark;
      
      const landmark = landmarks.find(l => l.id === landmarkId);
      
      if (landmark) { 
        setTargetLandmark(landmark);
        
        window.history.replaceState({}, document.title);
      }
    }
  }, []);


  useEffect(() => {
  if (targetLandmark && mapRef.current) {
    mapRef.current.flyTo(
      [targetLandmark.latitude, targetLandmark.longitude],
      6,
      { 
        animate: true,
        duration: 0.5
      }
    );
    setTargetLandmark(null);
  }
}, [targetLandmark]);


  useEffect(() => {
    let isActive = true;

    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    setSearchResults([]);

    const timeoutId = setTimeout(async () => {
      const data = await performSearch(searchQuery);
      if (isActive) {
        setSearchResults(data);
      }
    }, DEBOUNCE_DELAY);

    return () => {
    isActive = false;  // Invalidate previous effect
    clearTimeout(timeoutId);
    };
  }, [searchQuery]);



  const performSearch = async (query) => {

    if (query.trim() === '') return [];
    const jointArray = [];

    // 1. nase lokalne landmarky
    const landmarkMatches = landmarks.filter(landmark =>
      landmark.name.toLowerCase().includes(query.toLowerCase())
    );
  
    if (landmarkMatches.length >= 2) {
      jointArray.push(...landmarkMatches.slice(0, 2));
    } else {
      jointArray.push(...landmarkMatches);
    }

    const freeSpace = 5 - jointArray.length;

  
    // 2. hladanie nominatim
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    
    jointArray.push(...data.slice(0, freeSpace));

    return jointArray;
  };



    const flyToFirstResult = (results) => {
      const firstResult = results[0];
      const coords = firstResult.lat ? 
        [parseFloat(firstResult.lat), parseFloat(firstResult.lon)] :
        [firstResult.latitude, firstResult.longitude];
    
      mapRef.current?.flyTo(coords, 16,{ 
        animate: true,
        duration: 1.5
      });
    };

const handleSearchButton = () => {
  if (searchResults.length > 0){
    flyToFirstResult(searchResults);
    setSearchResults([]); 
  }
}


  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };



  const openModal = async () => {
    await checkAuth();
    if (!isLoggedIn) {
      navigate("/signin");
      return;
    }
    setCreateLandmarkOpened(true);

  }

  const closeModal = () => {
    setCreateLandmarkOpened(false);
  }

  const openDescriptionModal = (landmark) => {
    setLandmarkDescriptionOpened(true);
    setCurrentLandmark(landmark);
    console.log(landmark.name);
  }

  const closeDescriptionModal = () => {
    setLandmarkDescriptionOpened(false);
    setCurrentLandmark(null);
    fetchAllLandmarks();
  }



  const clearMarker = () => {
    setPosition(null);
  }

  useEffect(() => {
    if (position) {
      setTimeout(() => {
        markerRef.current?.openPopup();
      }, 0);
    }
  }, [position]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setSearchResults([]);
        const clickedMarker = landmarks.find(
          (landmark) => landmark.latitude === e.latlng.lat && landmark.longitude === e.latlng.lng
        );
  
        if (!clickedMarker) {
          setPosition(e.latlng);
        }
      },
    });
    return null;
  };

  
useEffect(() => {
  const map = mapRef.current;
  if (!map) return;
  
  const checkZoom = () => {
    const currentZoom = map.getZoom();
    const container = map.getContainer();
    const containerWidth = container.offsetWidth;
    
    // Calculate minimum zoom based on container size
    const minZoom = Math.max(2, Math.ceil(Math.log2(containerWidth / 256)));
    
    if (currentZoom < minZoom) {
      map.setZoom(minZoom);
    }
  };

  map.on('zoomend', checkZoom);
  return () => {
    map.off('zoomend', checkZoom);
  };
}, []);





    return (
      <>
        <MapContainer center={[48.8584, 2.2945]} zoom={5} className={mapStyles['map-container']} ref={mapRef}   maxBounds={[[-90, -180], [90, 180]]} maxBoundsViscosity={1.0} worldCopyJump={false} minZoom={3}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" noWrap={true} />
          {landmarks.map((landmark) => (
            <Marker position={[landmark.latitude, landmark.longitude]} key={landmark.id}>
                <Popup className={mapStyles['popup']} autoPan={true} autoPanPadding={L.point(20, 20)}>
                  <img className={mapStyles['popup-image']} src={landmark.image} alt="landmark image" />
                  <h2 className={mapStyles['popup-name']}>{landmark.name}</h2>
                  <button className={mapStyles['popup-button']} onClick={() => {openDescriptionModal(landmark); setSearchResults([]);}}>Learn more</button>
                </Popup>
            </Marker>
          ))}
          <MapClickHandler />
          {position && (
            <Marker position={position} ref={markerRef}>
              <Popup>
                <button className={mapStyles['create-button']} onClick={() => {openModal(); setSearchResults([]);}}>Add a new landmark</button>
              </Popup>
            </Marker>
            
          )}
          <div className={mapStyles['cover']}>Mystic Map &#174;</div>
        </MapContainer>
        {landmarkDescriptionOpened && (<LandmarkDescription landmark={currentLandmark} closeDescriptionModal={closeDescriptionModal} />)}
        {createLandmarkOpened && (<CreateNewLandmark lat={position.lat.toFixed(10)} lng={position.lng.toFixed(10)} closeModal={closeModal} clearMarker={clearMarker} />)}
        
        
        <div className={mapStyles['search-div']}>
          <input className={mapStyles['search-input']}
            type="text"
            placeholder="Search landmarks, cities, or countries..."
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchButton();
              }
            }}
          />
          <button className={mapStyles['search-button']} onClick={handleSearchButton}>Search</button>
          {/* Suggestions list */}
          {searchResults.length > 0 && (
            <div className={mapStyles['suggestions-div']}>
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className={mapStyles['suggestion']}
                  onClick={() => {flyToFirstResult([result]); setSearchResults([]);}}
                >
                  {result.display_name || result.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
}

export default Map