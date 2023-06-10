import axios from 'axios';
import React from 'react';
import SelectList from './SelectList';
import '../css/input.css'
import { useState } from 'react';

export default function UserInput() {
	const [comicsList, setComicsList] = useState([]);

	function convertToString(formSection) {
		if (formSection == null) {
			return "";
		}
		let elements = formSection.getElementsByClassName('search-tag-item');
		let stringList = "";

		for (var i = 0; i < elements.length; i++) {
			stringList += elements[i].textContent;
			if (i < elements.length - 1) {
				stringList += ',';
			}
		}
		return stringList;
	}

	function handleSubmit (event) {
		event.preventDefault();

		var	body = {
			characters: convertToString(document.getElementById('search-tags-characters')),
			writers: convertToString(document.getElementById('search-tags-writers')),
			pencilers: convertToString(document.getElementById('search-tags-pencilers')),
			inkers: convertToString(document.getElementById('search-tags-inkers')),
			colorists: convertToString(document.getElementById('search-tags-colorists')),
			letterers: convertToString(document.getElementById('search-tags-letterers')),
			editors: convertToString(document.getElementById('search-tags-editors'))
		};
		setComicsList(["loading"]);
		axios.post('http://127.0.0.1:8000/appearances', body)
		.then(function (response) {
			setComicsList(response.data.split(","));
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	function getResults() {
		if (comicsList.length === 0)
			return "";
		if (comicsList.length === 1 && comicsList[0] === "loading")
			return (<div class="loading">loading...</div>);
		return (
			<div class="results">
				<h4 class="results-title">Comics:</h4>
				<ul>
					{comicsList.map((option) => (
						<li class="result-item" id={option}>
							{option}
						</li>
					))}
				</ul>
            </div>
		)

	}

	return (
		<div class='form'>
			<div class="questions">
				<form name="input" onSubmit={handleSubmit}>
					<SelectList name="characters" category="Characters"/>
					<SelectList name="writers" category="Marvel_Staff/Writers"/>
					<SelectList name="pencilers" category="Marvel_Staff/Pencilers"/>
					<SelectList name="inkers" category="Marvel_Staff/Inkers"/>
					<SelectList name="colorists" category="Marvel_Staff/Colorists"/>
					<SelectList name="letterers" category="Marvel_Staff/Letterers"/>
					<SelectList name="editors" category="Marvel_Staff/Editors"/>
					<div id='submit' class="submit">
						<input class="submit-button" type="submit" value="Get comic book list"/>
					</div>
				</form>
			</div>
			<div class="result-section">
				{getResults()}
			</div>
		</div>
	)
}
