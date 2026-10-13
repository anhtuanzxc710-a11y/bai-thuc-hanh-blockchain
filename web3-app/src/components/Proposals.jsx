import Identicon from 'react-identicons'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { truncate, useGlobalState, daysRemaining } from '../store'
import { payoutBeneficiary } from "../Blockchain.services";
import { toast } from 'react-toastify'

const Proposals = () => {
  const [data] = useGlobalState('proposals')
  const [proposals, setProposals] = useState(data)

  const deactive = `bg-transparent
  text-blue-600 font-medium text-xs leading-tight
  uppercase hover:bg-blue-700 focus:bg-blue-700
  focus:outline-none focus:ring-0 active:bg-blue-600
  transition duration-150 ease-in-out overflow-hidden
  border border-blue-600 hover:text-white focus:text-white`

  const active = `bg-blue-600
  text-white font-medium text-xs leading-tight
  uppercase hover:bg-blue-700 focus:bg-blue-700
  focus:outline-none focus:ring-0 active:bg-blue-800
  transition duration-150 ease-in-out overflow-hidden
  border border-blue-600`

  const getAll = () => setProposals(data)

  const getOpened = () =>
    setProposals(
      data.filter(
        (proposal) =>
          new Date().getTime() <
          Number(proposal.duration + '000')
      )
    )

  const getClosed = () =>
    setProposals(
      data.filter(
        (proposal) =>
          new Date().getTime() >
          Number(proposal.duration + '000')
      )
    )

  const handlePayout = async (id) => {
    await payoutBeneficiary(id)
    toast.success("Beneficiary successfully Paid Out!");
  }

  return (
    <div className="flex flex-col p-8">
      <div
        className="flex flex-row justify-center items-center"
        role="group"
      >
        <button
          aria-current="page"
          className={`rounded-l-full px-6 py-2.5 ${active}`}
          onClick={getAll}
        >
          All
        </button>

        <button
          aria-current="page"
          className={`px-6 py-2.5 ${deactive}`}
          onClick={getOpened}
        >
          Open
        </button>

        <button
          aria-current="page"
          className={`rounded-r-full px-6 py-2.5 ${deactive}`}
          onClick={getClosed}
        >
          Closed
        </button>
      </div>

      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="h-[calc(100vh_-_20rem)] overflow-y-auto shadow-md rounded-md">
            <table className="min-w-full">
              <thead className="border-b dark:border-gray-500">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium px-6 py-4 text-left"
                  >
                    Created By
                  </th>

                  <th
                    scope="col"
                    className="text-sm font-medium px-6 py-4 text-left"
                  >
                    Title
                  </th>

                  <th
                    scope="col"
                    className="text-sm font-medium px-6 py-4 text-left"
                  >
                    Expires
                  </th>

                  <th
                    scope="col"
                    className="text-sm font-medium px-6 py-4 text-left"
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {proposals.map((proposal) => (
                  <tr
                    key={proposal.id}
                    className="border-b dark:border-gray-500"
                  >
                    <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-row justify-start items-center space-x-3">
                        <Identicon
                          string={proposal.proposer.toLowerCase()}
                          size={25}
                          className="h-10 w-10 object-contain rounded-full mr-3"
                        />
                        <span>
                          {truncate(
                            proposal.proposer,
                            4,
                            4,
                            11
                          )}
                        </span>
                      </div>
                    </td>

                    <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/proposal/${proposal.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {proposal.title}
                      </Link>
                    </td>

                    <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                      {daysRemaining(proposal.duration)}
                    </td>

                    <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                      {new Date().getTime() >
                        Number(proposal.duration + '000') &&
                      proposal.upvotes > proposal.downvotes &&
                      !proposal.paid ? (
                        <button
                          type="button"
                          className="border-2 rounded-full px-6 py-2.5
                          border-blue-600 text-blue-600
                          font-medium text-xs leading-tight
                          uppercase hover:border-blue-700
                          focus:border-blue-700 focus:outline-none
                          focus:ring-0 active:border-blue-800
                          transition duration-150 ease-in-out"
                          onClick={() =>
                            handlePayout(proposal.id)
                          }
                        >
                          Pay
                        </button>
                      ) : proposal.paid ? (
                        <button
                          type="button"
                          className="border-2 rounded-full px-6 py-2.5
                          border-green-600 text-green-600
                          font-medium text-xs leading-tight
                          uppercase"
                        >
                          Paid
                        </button>
                      ) : (
                        <Link
                          to={`/proposal/${proposal.id}`}
                          className="border-2 rounded-full px-6 py-2.5
                          border-blue-600 text-blue-600
                          font-medium text-xs leading-tight
                          uppercase"
                        >
                          View
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Proposals