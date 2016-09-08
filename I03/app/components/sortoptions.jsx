import React from 'react';
import { connect } from 'react-redux';

const SortOptions = ({setSortCriteria, sortCriteria}) => (
    <div className = 'sortOptions'>
        <bdi>Sorter etter: </bdi>
        <select onChange = {(event) => {setSortCriteria(event.target.value)}}>
            <option value='added'>Dato lagt til</option>
            <option value='upvotes'>Upvotes</option>
        </select>
    </div>
);

export default connect(state => ({sortCriteria: state.sortCriteria}))(SortOptions);