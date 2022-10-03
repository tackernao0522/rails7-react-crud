import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Editor from './Editor';
import './App.css';

const App = () => (
  <Routes>
    <Route path="events/*" element={<Editor />} />
  </Routes>
);

export default App;
