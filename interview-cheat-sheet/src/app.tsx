import { useEffect, useRef } from "preact/hooks";
import { useSignal, useComputed } from "@preact/signals";

import codeColor from "./fixtures/code-color.json";

import asymptoticNotations from "./fixtures/asymptotic-notations.json";
import timeComplexities from "./fixtures/time-complexities.json";
import sortingAlgorithms from "./fixtures/sorting-algorithms.json";
import searchAlgorithms from "./fixtures/search-algorithms.json";
import dataStructures from "./fixtures/data-structures.json";

import objectOriented from "./fixtures/object-oriented-programming.json";
import pyNotes from "./fixtures/python-notes.json";
import pyModules from "./fixtures/python-modules.json";
import apiNotes from "./fixtures/api-notes.json";
import sqlNotes from "./fixtures/sql-notes.json";
import resourcesLinks from "./fixtures/resources-links.json";

/*
Best    => big-omega
Average => theta
Worst   => big-o
*/

/* Components */
function Note(props: any) {
  return (
    <div class="note-box">
      <div class="note-title">{props.title || "Note"}</div>
      <span class="note-text">{props.children}</span>
    </div>
  );
}

function Title(props: any) {
  return (
    <div class="title-bar">
      <span class="title">{props.text}</span>
      {props.children}
    </div>
  );
}

const Code = (props: any) => {
  // Create a ref to the code element
  const codeRef = useRef(null);

  // Run Highlight.js on the code element when the component mounts
  useEffect(() => {
    if (codeRef.current) {
      //@ts-ignore
      hljs.highlightBlock(codeRef.current);
    }
  }, [props.text]);

  return (
    <pre>
      <code ref={codeRef} className={`language-${props.lang}`}>
        {props.text}
      </code>
    </pre>
  );
};

/* App */
function VisualChart() {
  return <img src="./big-o-chart.png" />;
}

function AsymptoticTable() {
  const asymptoticRows = asymptoticNotations.map((item) => (
    <tr>
      <td>{item.name}</td>
      <td>{item.notation}</td>
      <td class="tal">{item.description}</td>
      <td>{item.simplified}</td>
      <td class="tal">{item.note}</td>
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
      <Title text="Asymptotic Notations" />
      <table>
        <thead>
          <tr>
            <th style="width: 100px">Name</th>
            <th>Notation</th>
            <th>Description</th>
            <th style="width: 120px">Simplified</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>{asymptoticRows}</tbody>
      </table>

      <Note>
        Asymptotic notations like <strong>Big O</strong>,{" "}
        <strong>Big Omega</strong> and <strong>Big Theta</strong>, provide
        insights into the runtime performance characteristics of algorithms.
        <br />
        On the other hand, terms like <strong>Best Case</strong>,{" "}
        <strong>Worst Case</strong> and <strong>Expected Case</strong> describe
        the algorithm's performance under specific conditions or input.
        <br />
        Please note that there is{" "}
        <strong>no specific relationship between these two concepts</strong>.
      </Note>

      <br />

      <Title text="Time & Space Complexities" />

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

      <Note>
        <strong>Log(n)</strong> without a specified base, it's usually assumed
        to be <strong>base 2</strong>.
      </Note>

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

  const CrudHeaders = ["Access", "Search", "Insertion", "Deletion"].map(
    (item) => <th>{item}</th>
  );

  return (
    <>
      <Title text="Data Structures">
        <input
          onInput={(e: any) => (searchQuery.value = e.target.value)}
          placeholder="Search"
        />
      </Title>

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
            {CrudHeaders}
            {CrudHeaders}
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
      <Title text="Sorting Algorithms">
        <input
          onInput={(e: any) => (searchQuery.value = e.target.value)}
          placeholder="Search"
        />
      </Title>

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
      <Title text="Array Search Operations" />

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

      <Title text="Graph Search Operations" />

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
      <Title text="Object-Oriented Programming (OOP)" />
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

      <Title text="Solid Principles" />
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

      <Title text="Software Design Patterns" />
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

      <Title text="Software Development Principles" />
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

      <Title text="Software Development Paradigms" />
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

function RestTable() {
  return (
    <>
      <div style="display: flex; ">
        <div>
          <Title text="REST Architectural Constraints" />
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

          <Note>
            <strong>REST</strong> stands for{" "}
            <strong>REpresentational State Transfer</strong>
          </Note>
        </div>

        <div style="margin-left: 30px;">
          <Title text="REST Methods" />
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

      <br />

      <div>
        <Title text="GraphQL" />
        <table>
          <thead>
            <tr>
              <th style="width: 160px">Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {apiNotes.graphql.map((item) => (
              <tr>
                <td>{item.name}</td>
                <td class="tal">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SQLTable() {
  return (
    <>
      <Title text="SQL (Structured Query Language)" />
      <Code lang="sql" text={`SELECT column_1, column_2 FROM table_name;`} />

      <br />

      <table>
        <thead>
          <tr>
            <th style="width: 120px">Statement</th>
            <th>Description</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          {sqlNotes.map((item) => (
            <tr>
              <td>{item.statement}</td>
              <td class="tal">{item.description}</td>
              <td class="tal">
                <Code lang="sql" text={item.example} />
              </td>
            </tr>
          ))}
        </tbody>
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
      <Title text="Dunder Methods">
        <input
          onInput={(e: any) => (searchQuery.value = e.target.value)}
          placeholder="Search"
        />
      </Title>
      <table>
        <thead>
          <tr>
            <th style="width: 110px">Magic Method</th>
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
  return (
    <>
      <Title text="PEP 20 – The Zen of Python" />
      <table>
        <thead>
          <tr>
            <th style="width: 30px">Index</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {pyNotes.zen.map((item) => (
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

function PythonOtherNotesTable() {
  return (
    <>
      <Title text="Useful Notes" />
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
        <PythonOtherNotesTable />
      </div>
    </div>
  );
}

function PythonMethodsTable() {
  const allPyMethods: any = [];
  Object.keys(pyModules).forEach((group: any) => {
    //@ts-ignore
    pyModules[group].forEach((item) => {
      allPyMethods.push({
        method: item.method,
        group: group,
        description: item.description,
      });
    });
  });

  const searchQuery = useSignal("");
  const datasetMagic = useComputed(() => {
    return allPyMethods.filter(
      (row: any) =>
        row.method.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        row.group.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        row.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  return (
    <>
      <Title text="Common Methods">
        <input
          onInput={(e: any) => (searchQuery.value = e.target.value)}
          placeholder="Search"
        />
      </Title>
      <table>
        <thead>
          <tr>
            <th style="width: 380px">Method</th>
            <th>Group</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {datasetMagic.value.map((item: any) => (
            <tr>
              <td>{item.method}</td>
              <td>{item.group}</td>
              <td class="tal">{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function PythonExtended() {
  return (
    <div style="display: flex; justify-content: space-between">
      <div>
        <PythonMethodsTable />
      </div>
    </div>
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
        <li onClick={() => (currentView.value = 6)}>SQL</li>
        <li onClick={() => (currentView.value = 7)}>Python</li>
        <li onClick={() => (currentView.value = 8)}>Python Extended</li>
        <li onClick={() => (currentView.value = 99)}>Resources</li>
        <li
          onClick={() =>
            window.open("https://github.com/hlop3z/interviews-python", "_blank")
          }
          style="float: right;"
        >
          GitHub
        </li>
      </ul>

      {show(0, <AsymptoticTable />)}
      {show(1, <DataStructuresTable />)}
      {show(2, <SortingAlgorithmsTable />)}
      {show(3, <SearchAlgorithmsTable />)}
      {show(4, <ObjectOrientedTable />)}
      {show(5, <RestTable />)}
      {show(6, <SQLTable />)}
      {show(7, <PythonTable />)}
      {show(8, <PythonExtended />)}
      {show(99, <ResourcesView />)}
    </>
  );
}
