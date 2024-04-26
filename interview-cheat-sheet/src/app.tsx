// import { useState } from "preact/hooks";
import { useSignal, useComputed } from "@preact/signals";

import codeColor from "./fixtures/code-color.json";

import asymptoticNotations from "./fixtures/asymptotic-notations.json";
import timeComplexities from "./fixtures/time-complexities.json";
import sortingAlgorithms from "./fixtures/sorting-algorithms.json";
import searchAlgorithms from "./fixtures/search-algorithms.json";
import dataStructures from "./fixtures/data-structures.json";

import objectOriented from "./fixtures/object-oriented-programming.json";
import pyNotes from "./fixtures/python-notes.json";
import apiNotes from "./fixtures/api-notes.json";
import resourcesLinks from "./fixtures/resources-links.json";

/*
Best    => big-omega
Average => theta
Worst   => big-o
*/

function VisualChart() {
  return <img src="./big-o-chart.png" />;
}

function AsymptoticTable() {
  const asymptoticRows = asymptoticNotations.map((item) => (
    <tr>
      <td>{item.name}</td>
      <td>{item.notation}</td>
      <td class="tal">{item.description}</td>
      <td>{item.note}</td>
    </tr>
  ));

  const TD = (p: any) => (
    //@ts-ignore
    <td class={`${codeColor[p.item]}`}>{p.name || p.item}</td>
  );

  const complexityRows = timeComplexities.map((item) => (
    <tr>
      <td>{item.name}</td>
      <TD name={item.notation} item={item.level} />
      <td class="tal">{item.description}</td>
      <TD item={item.level} />
    </tr>
  ));

  return (
    <>
      <div class="title-bar">
        <span class="title">Asymptotic Notations</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Notation</th>
            <th>Description</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>{asymptoticRows}</tbody>
      </table>

      <br />

      <div class="title-bar">
        <span class="title">Time Complexities</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Notation</th>
            <th>Description</th>
            <th>Quality</th>
          </tr>
        </thead>
        <tbody>{complexityRows}</tbody>
      </table>

      <div>
        <br />
        <strong>Note:</strong> log(n) without a specified base, it's usually
        assumed to be base 2.
      </div>

      <br />

      <div class="tac">
        <div class="title-bar" style="justify-content:center;">
          <span class="title">Visual Chart</span>
        </div>
        <VisualChart />
      </div>
    </>
  );
}

function DataStructuresTable() {
  const searchQuery = useSignal("");
  const dataset = useComputed(() => {
    return dataStructures.filter(
      (row) =>
        row.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        row.group.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  //@ts-ignore
  const TD = (p: any) => <td class={`${codeColor[p.item]}`}>{p.item}</td>;

  const theTable = dataset.value.map((item) => (
    <tr>
      <td>{item.name}</td>
      <td>
        <img class="shape" src={`./shapes/${item.shape}`} />
      </td>
      <td>{item.group}</td>
      <td class="tal">{item.description}</td>

      <TD item={item.time.average.access} />
      <TD item={item.time.average.search} />
      <TD item={item.time.average.insertion} />
      <TD item={item.time.average.deletion} />

      <TD item={item.time.worst.access} />
      <TD item={item.time.worst.search} />
      <TD item={item.time.worst.insertion} />
      <TD item={item.time.worst.deletion} />

      <TD item={item.space.worst} />
    </tr>
  ));

  return (
    <>
      <div class="title-bar">
        <span class="title">Data Structures</span>
        <input
          onInput={(e: any) => (searchQuery.value = e.target.value)}
          placeholder="Search"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th colspan={4}></th>
            <th colspan={8}>Time Complexity</th>
            <th>Space Complexity</th>
          </tr>
          <tr>
            <th colspan={4}></th>
            <th colspan={4}>Average</th>
            <th colspan={4}>Worst</th>
            <th>Worst</th>
          </tr>
          <tr>
            <th style="width: 140px">Data Structure</th>
            <th style="width: 100px">Shape</th>
            <th style="width: 60px">Group</th>
            <th style="width: 240px">Description</th>
            <th>Access</th>
            <th>Search</th>
            <th>Insertion</th>
            <th>Deletion</th>
            <th>Access</th>
            <th>Search</th>
            <th>Insertion</th>
            <th>Deletion</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{theTable}</tbody>
      </table>
    </>
  );
}

export function SortingAlgorithmsTable() {
  const searchQuery = useSignal("");
  const dataset = useComputed(() => {
    return sortingAlgorithms.filter((row) =>
      row.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  //@ts-ignore
  const TD = (p: any) => <td class={`${codeColor[p.item]}`}>{p.item}</td>;

  const theTable = dataset.value.map((item) => (
    <tr>
      <td>{item.name}</td>
      <td class="tal" style="height: 60px">
        {item.description}
      </td>

      <TD item={item.time.best} />
      <TD item={item.time.average} />
      <TD item={item.time.worst} />

      <TD item={item.space.worst} />
    </tr>
  ));

  return (
    <>
      <div class="title-bar">
        <span class="title">Sorting Algorithms</span>
        <input
          onInput={(e: any) => (searchQuery.value = e.target.value)}
          placeholder="Search"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th colspan={2}></th>
            <th colspan={3}>Time Complexity</th>
            <th>Space Complexity</th>
          </tr>
          <tr>
            <th style="width: 100px">Algorithm</th>
            <th style="width: 600px">Description</th>
            <th>Best</th>
            <th>Average</th>
            <th>Worst</th>
            <th>Worst</th>
          </tr>
        </thead>
        <tbody>{theTable}</tbody>
      </table>
    </>
  );
}

function SearchAlgorithmsTable() {
  const arrayTable = searchAlgorithms.array.map((item) => (
    <tr>
      <td>{item.name}</td>
      <td class="tal">{item.description}</td>
      <td>{item.average}</td>
      <td>{item.worst}</td>
    </tr>
  ));

  const graphTable = searchAlgorithms.graph.map((item) => (
    <tr>
      <td>{item.name}</td>
      <td class="tal">{item.description}</td>
      <td>{item.average}</td>
      <td>{item.worst}</td>
    </tr>
  ));

  return (
    <>
      <div class="title-bar">
        <span class="title">Array Search Operations</span>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th style="width: 100px">Algorithm</th>
              <th>Description</th>
              <th>Average Time Complexity</th>
              <th>Worst Time Complexity</th>
            </tr>
          </thead>
          <tbody>{arrayTable} </tbody>
        </table>
      </div>

      <br />

      <div class="title-bar">
        <span class="title">Graph Search Operations</span>
      </div>
      <div style="display: flex">
        <div>
          <table>
            <thead>
              <tr>
                <th style="width: 100px">Algorithm</th>
                <th>Description</th>
                <th>Average Time Complexity</th>
                <th>Worst Time Complexity</th>
              </tr>
            </thead>
            <tbody>{graphTable} </tbody>
          </table>
        </div>

        <div class="graph-help" style="width: 440px">
          <ul>
            <li>
              <code>v</code>: Number of vertices (nodes) in the graph.
            </li>
            <li>
              <code>e</code>: Number of edges in the graph.
            </li>
            <li>
              <code>b</code>: Branching factor of the search tree.
            </li>
            <li>
              <code>d</code>: Depth of the optimal solution.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

function ObjectOrientedTable() {
  const tableRow = (item: any) => (
    <tr>
      <td>{item.name}</td>
      <td class="tal">{item.description}</td>
    </tr>
  );

  return (
    <>
      <div class="title-bar">
        <span class="title">Object-Oriented Programming (OOP)</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 100px">Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>{objectOriented.oop.map(tableRow)}</tbody>
      </table>

      <br />

      <div class="title-bar">
        <span class="title">Solid Principles</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 160px">Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>{objectOriented.solid.map(tableRow)}</tbody>
      </table>

      <br />

      <div class="title-bar">
        <span class="title">Software Design Patterns</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 160px">Pattern</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>{objectOriented.design.map(tableRow)}</tbody>
      </table>

      <br />

      <div class="title-bar">
        <span class="title">Software Development Principles</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 260px">Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>{objectOriented.principles.map(tableRow)}</tbody>
      </table>

      <br />

      <div class="title-bar">
        <span class="title">Software Development Paradigms</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 360px">Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>{objectOriented.paradigms.map(tableRow)}</tbody>
      </table>
    </>
  );
}

function PythonDunderMethodsTable() {
  const searchQuery = useSignal("");
  const datasetMagic = useComputed(() => {
    return pyNotes.magic.filter(
      (row) =>
        row.method.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        row.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  return (
    <>
      <div class="title-bar">
        <span class="title">Dunder Methods</span>
        <input
          onInput={(e: any) => (searchQuery.value = e.target.value)}
          placeholder="Search"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 160px">Magic Method</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {datasetMagic.value.map((item) => (
            <tr>
              <td>{item.method}</td>
              <td class="tal">{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function PythonZenTable() {
  const searchQuery = useSignal("");
  const datasetMagic = useComputed(() => {
    return pyNotes.zen.filter((row) =>
      row.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  return (
    <>
      <div class="title-bar">
        <span class="title">PEP 20 – The Zen of Python</span>
        <input
          style="display:none;"
          onInput={(e: any) => (searchQuery.value = e.target.value)}
          placeholder="Search"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 30px">Index</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {datasetMagic.value.map((item) => (
            <tr>
              <td>{item.index}</td>
              <td class="tal">{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function PythonOthersTable() {
  return (
    <>
      <div class="title-bar">
        <span class="title">Useful Notes</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 160px">Title</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {pyNotes.others.map((item) => (
            <tr>
              <td>{item.title}</td>
              <td class="tal">{item.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function PythonTable() {
  return (
    <div style="display: flex; justify-content: space-between">
      <div>
        <PythonDunderMethodsTable />
      </div>
      <div>
        <PythonZenTable />
      </div>
      <div>
        <PythonOthersTable />
      </div>
    </div>
  );
}

function RestTable() {
  return (
    <>
      <div style="display: flex; ">
        <div>
          <div class="title-bar">
            <span class="title">REST Architectural Constraints</span>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 200px">Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {apiNotes.rest_constraints.map((item) => (
                <tr>
                  <td>{item.name}</td>
                  <td class="tal">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <br />

          <div class="note-box">
            <strong class="note-text">Note</strong>
            <span style="font-size: 18px">
              <strong>REST</strong> stands for{" "}
              <strong>"Representational State Transfer"</strong>
            </span>
          </div>
        </div>

        <div style="margin-left: 30px;">
          <div class="title-bar">
            <span class="title">REST Methods</span>
          </div>
          <table style="width:300px">
            <thead>
              <tr>
                <th>Name</th>
                <th>CRUD</th>
              </tr>
            </thead>
            <tbody>
              {apiNotes.rest_methods.map((item) => (
                <tr>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ResourcesView() {
  return (
    <>
      <div class="title-bar">
        <span class="title">Resources Links</span>
      </div>
      <ul class="links">
        {resourcesLinks.map((item) => (
          <li>
            <a href={item.url} target="_blank">
              {item.title}
            </a>
          </li>
        ))}
      </ul>

      <br />
      <br />
      <div>
        <strong>Disclaimer:</strong> The information in this website was gather
        with the help of ChatGPT and Copilot.
      </div>
    </>
  );
}

export function App() {
  const currentView = useSignal(0);

  const show = (value: any, view: any) =>
    currentView.value === value ? view : null;

  return (
    <>
      <ul class="navbar">
        <li onClick={() => (currentView.value = 0)}>Big-O</li>
        <li onClick={() => (currentView.value = 1)}>Data Structures</li>
        <li onClick={() => (currentView.value = 2)}>Sorting</li>
        <li onClick={() => (currentView.value = 3)}>Searching</li>
        <li onClick={() => (currentView.value = 4)}>Principles & Design</li>
        <li onClick={() => (currentView.value = 5)}>APIs</li>
        <li onClick={() => (currentView.value = 6)}>Python</li>
        <li onClick={() => (currentView.value = 7)}>Resources</li>
      </ul>

      {show(0, <AsymptoticTable />)}
      {show(1, <DataStructuresTable />)}
      {show(2, <SortingAlgorithmsTable />)}
      {show(3, <SearchAlgorithmsTable />)}
      {show(4, <ObjectOrientedTable />)}
      {show(5, <RestTable />)}
      {show(6, <PythonTable />)}
      {show(7, <ResourcesView />)}
    </>
  );
}
