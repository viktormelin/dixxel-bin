import { GetServerSideProps } from 'next';
import React, { FormEvent, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	Autocomplete,
	Box,
	Button,
	Container,
	Grid,
	Icon,
	IconButton,
	Input,
	Slider,
	Stack,
	Switch,
	TextField,
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material';
import axios from 'axios';
import {
	DirectionsRenderer,
	DirectionsService,
	GoogleMap,
	LoadScript,
	Marker,
	StandaloneSearchBox,
	useGoogleMap,
} from '@react-google-maps/api';

const Map = () => {
	const [map, setMap] = useState<google.maps.Map>();
	const [zoom, setZoom] = useState<number>(12);
	const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 59.33, lng: 18.06 });

	const [value, setValue] = useState<any>(null);
	const [inputValue, setInputValue] = useState<string>('');
	const [options, setOptions] = useState<any>([]);
	const [radius, setRadius] = useState<number>(500);
	const [target, setTarget] = useState<any>(null);
	const [route, setRoute] = useState<any>(null);

	const findRestaurant = async () => {
		if (map) {
			const center = map.getCenter();
			const lat = center?.lat();
			const lng = center?.lng();
			const coords = `${lat},${lng}`;

			const {
				data: { results },
			} = await axios.get(`/api/place/nearbysearch?coord=${coords}&radius=${radius}`);

			const randomPlace = results[Math.floor(Math.random() * results.length)];
			setTarget(randomPlace);
		}
	};

	const zoomIn = () => {
		if (zoom + 1 <= 20) {
			setZoom(zoom + 1);
		}
	};

	const zoomOut = () => {
		if (zoom - 1 >= 3) {
			setZoom(zoom - 1);
		}
	};

	const centerLocation = () => {
		navigator.geolocation.getCurrentPosition((position) => {
			setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
		});
	};

	const updateMapPosition = async (event: any, input: any) => {
		if (event.type === 'click' && typeof input === 'object') {
			const { place_id } = input;

			const {
				data: { result },
			} = await axios.get(`/api/place/details/${place_id}`);
			setCoords(result.geometry.location);
		}
	};

	const onLoad = (mapInstance: any) => {
		setMap(mapInstance);
	};

	const valuetext = (value: number) => {
		return `Radius ${value}`;
	};

	const radiusChange = (_: Event, value: number | number[]) => {
		const val = Array.isArray(value) ? value[0] : value;
		setRadius(val);
	};

	const directionServiceCallback = (response: any) => {
		if (!route) {
			if (response && response.status === 'OK') {
				console.log(response);
				setRoute(response);
			} else {
				console.error(response);
			}
		}
	};

	useEffect(() => {
		let active = true;
		if (inputValue === '') {
			setOptions(value ? [value] : []);
			return undefined;
		}

		const fetch = async () => {
			if (active) {
				const { data } = await axios.get(`/api/place/autocomplete/${inputValue}`);

				let newOptions: any = [];

				if (value) {
					newOptions = [value];
				}

				if (data) {
					newOptions = [...newOptions, ...data];
				}

				setOptions(newOptions);
			}
		};

		fetch();
	}, [inputValue, value]);

	return (
		<Box
			sx={{
				height: '100vh',
				width: '100vw',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Container
				maxWidth='md'
				sx={{
					// height: '100vh',
					// display: 'flex',
					// flexDirection: 'column',
					// alignItems: 'center',
					// justifyContent: 'center',
					position: 'absolute',
					zIndex: '99',
				}}
			>
				<Box
					sx={{
						width: '100%',
						display: 'flex',
						marginTop: '2rem',
						justifyContent: 'center',
					}}
				>
					<Autocomplete
						id='mapbox-place-search'
						getOptionLabel={(option: any) => option.description}
						filterOptions={(x) => x}
						options={options}
						autoComplete
						includeInputInList
						filterSelectedOptions
						value={value}
						sx={{
							width: '100%',
							boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px;',
						}}
						onChange={(event, newValue) => {
							setOptions(newValue ? [newValue, ...options] : options);
							setValue(newValue);
							updateMapPosition(event, newValue);
						}}
						onInputChange={(event, newInputvalue) => {
							setInputValue(newInputvalue);
						}}
						renderInput={(params) => <TextField variant='filled' {...params} label='Search for a location' />}
						renderOption={(props: any, option: any) => {
							return (
								<li {...props} key={option.id}>
									<Grid container alignItems='center' gap='1rem'>
										<Grid item alignItems='center'>
											<Icon>location_on</Icon>
										</Grid>
										<Grid item xs>
											<Typography variant='body1'>{option.structured_formatting.main_text}</Typography>
											<Typography variant='body2' color='text.secondary'>
												{option.structured_formatting.secondary_text}
											</Typography>
										</Grid>
									</Grid>
								</li>
							);
						}}
					/>
				</Box>
			</Container>
			<Box
				sx={{
					height: '100%',
					width: '100%',
					position: 'absolute',
					top: '0',
					left: '0',
					zIndex: '0',
				}}
			>
				<LoadScript googleMapsApiKey='AIzaSyCWLnjy7CBFvGRy6DAcfiAANNldoNzGv4E'>
					<GoogleMap
						options={{ disableDefaultUI: true }}
						center={coords}
						zoom={zoom}
						onLoad={onLoad}
						mapContainerStyle={{
							height: '100%',
							width: '100%',
						}}
					>
						{target ? (
							<>
								<Marker
									position={coords}
									icon={{
										path: google.maps.SymbolPath.CIRCLE,
										fillColor: '#4285F4',
										fillOpacity: 1,
										scale: 12,
										strokeColor: '#fff',
										strokeWeight: 3,
									}}
								/>
								<Marker position={target.geometry.location} />
							</>
						) : null}
						{target && coords ? (
							<DirectionsService
								options={{
									destination: target.geometry.location,
									origin: coords,
									travelMode: google.maps.TravelMode['DRIVING'],
								}}
								callback={directionServiceCallback}
							/>
						) : null}
						{route ? <DirectionsRenderer options={{ directions: route }} /> : null}
						<Box
							sx={{
								width: '100%',
								height: '100%',
								display: 'flex',
								alignItems: 'flex-end',
								justifyContent: 'space-between',
								padding: '2rem',
							}}
						>
							<Box
								sx={{
									width: '100%',
									display: 'flex',
									alignItems: 'flex-end',
									justifyContent: 'space-between',
								}}
							>
								<Box>
									<Button onClick={centerLocation} variant='contained'>
										<Icon>my_location</Icon>
									</Button>
								</Box>
								<Box>
									<Button onClick={findRestaurant} variant='contained' sx={{ display: 'flex', gap: '1rem' }}>
										<Typography variant='body2'>Find restaurant</Typography>
										<Icon>search</Icon>
									</Button>
									<Box>
										<Slider
											aria-label='radius'
											defaultValue={500}
											getAriaValueText={valuetext}
											step={100}
											valueLabelDisplay='auto'
											min={100}
											max={2000}
											onChange={radiusChange}
										/>
										<Stack
											sx={{
												flexDirection: 'row',
												gap: '1rem',
												alignItems: 'center',
												backgroundColor: '#0083cb',
											}}
										>
											<Typography>Walking</Typography>
											<Switch defaultChecked inputProps={{ 'aria-label': 'driving or walking' }} />
											<Typography>Driving</Typography>
										</Stack>
									</Box>
								</Box>
								<Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
									<Button onClick={zoomIn} variant='contained'>
										<Icon>zoom_in</Icon>
									</Button>

									<Button onClick={zoomOut} variant='contained'>
										<Icon>zoom_out</Icon>
									</Button>
								</Box>
							</Box>
						</Box>
					</GoogleMap>
				</LoadScript>
			</Box>
		</Box>
	);
};

export default Map;
