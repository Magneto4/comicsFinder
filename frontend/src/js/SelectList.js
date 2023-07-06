import getListFromWiki from './getListFromWiki';
import React from 'react';
import "../css/SelectList.css";
import { useState } from 'react';

const CloseIcon = () => {
    return (
        <svg height="20" width="20" viewBox="0 0 20 20">
            <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
        </svg>
    );
};



export default function SelectList (props) {
	const list = [];
	const [selectedValue, setSelectedValue] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [onValue, setOnValue] = useState(-1);
	getListFromWiki(props.category, list);
	let newSelectedValue = [];

	function redoList(value) {
		var menu = document.getElementById("search-results-" + props.name);
		menu.innerHTML = "";
		if (value.length === 0)
		return ;
		let i = 0;
		for (let el of list) {
			if (el.toLowerCase().includes(value.toLowerCase())) {
				var div = document.createElement('div');
				div.innerHTML = div.innerHTML + el;
				div.setAttribute('class', "search-results-item");
				div.setAttribute('id', i++);
				div.onclick = function (event) {onItemClick(event, el)};
				menu.insertAdjacentElement('beforeend', div);
			}
		}
	}
	
	const onSearch = (e) => {
		newSelectedValue = selectedValue;
		setSearchValue(e.target.value);
		setOnValue(-1);
		redoList(e.target.value);
    };
	
	function onItemClick (event, option) {
		event.preventDefault();
		newSelectedValue = selectedValue;
		if (newSelectedValue.findIndex((o) => o === option) < 0) {
			newSelectedValue = [...newSelectedValue, option];
		}
		setOnValue(-1);
		setSearchValue("");
		setSelectedValue(newSelectedValue);
		redoList("");
	}

	function getDisplay() {
		if (selectedValue.length === 0)
			return "";
		return (
			<div class="search-tags" id={"search-tags-" + props.name}>
                {selectedValue.map((option) => (
                    <div class="search-tag-item">
                        {option}
                        <span onClick={(e) => onTagRemove(e, option)} class="search-tag-close"><CloseIcon /></span>
                    </div>
                ))}
            </div>
		)
	}

	const removeOption = (option) => {
		return (newSelectedValue.filter((o) => o !== option));
	};

	const onTagRemove = (e, option) => {
		e.stopPropagation();
		e.preventDefault();
		newSelectedValue = selectedValue;
		newSelectedValue = removeOption(option);
		setSelectedValue(newSelectedValue);
	};

	const keyDown = (e) => {
		if (e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 13)
			return ;
		e.preventDefault();
		let list = document.getElementsByClassName('search-results-item');
		if (list.length === 0) {
			return;
		}
		if (e.keyCode === 13) {
			if (onValue === -1) {
				return ;
			}
			onItemClick(e, document.getElementById(onValue).textContent);
			return;
		}
		let newValue;
		if (e.keyCode === 38) {
			newValue = onValue - 1;
		} else if (e.keyCode === 40) {
			newValue = onValue + 1;
		}
		if (newValue === list.length || newValue < 0) {
			return ;
		}
		if (document.getElementById(onValue)) {
			document.getElementById(onValue).style.backgroundColor = "#ffc6c6";
		}
		document.getElementById(newValue).style.backgroundColor = "#cf6f6f";
		document.getElementById(newValue).scrollIntoView(false);
		setOnValue(newValue);
	}

	return (
		<div class="search-list">
			<div class="list-title">
				<h4>{props.name + ":"}</h4>
			</div>
			<div class="search-selected-values">
				{getDisplay(selectedValue)}
			</div>
			<input
				class="search-bar"
				onChange={onSearch}
				value={searchValue}
				onKeyDown={keyDown}
			/>
			<div
				class="search-results"
				id={"search-results-" + props.name}
			>
			</div>
		</div>
	)
}
