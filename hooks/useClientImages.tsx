import React, { useEffect, useState } from 'react';

interface Images {
	loading: boolean;
	data: any;
	refetch: any;
}

const useClientImages = ({ scope }: { scope: string }) => {
	const [images, setImages] = useState<Images>({
		loading: true,
		data: [],
		refetch: null,
	});

	useEffect(() => {
		const fetchMovies = async () => {
			await fetch(`/api/files/images?type=fetch&scope=${scope}`, { method: 'GET', body: null }).then((res) =>
				res.json().then((data) =>
					setImages({
						loading: false,
						data,
						refetch: fetchMovies,
					})
				)
			);
		};

		fetchMovies();
	}, [scope]);

	return images;
};

export default useClientImages;
